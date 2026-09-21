import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  useCreateBill,
  useDeleteBill,
  usePayBill,
  useSplitBill,
  useUpdateBill,
} from '@api/hooks/useBills'
import { useTableById } from '@api/hooks/useTables'
import { useCategories } from '@api/hooks/useCategories'
import { useProductsByCategories } from '@api/hooks/useProducts'
import type { Product } from '@api/__generated__'
import PageHeader from '@components/ui/PageHeader'
import { EmptyState, LoadingState } from '@components/ui/Feedback'
import ProductPicker from './components/ProductPicker'
import OrderPanel, { OrderLine } from './components/OrderPanel'
import SplitBillModal from './components/SplitBillModal'
import { errorMessage } from '@api/client/errorMessage'
import { money } from '@lib/money'

const NEW_BILL = 'new'

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  padding: 0;
  border: none;
  background: none;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.color.textMuted};

  svg {
    font-size: 1rem;
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
`

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transition.fast};

  background-color: ${({ theme, $active }) => ($active ? theme.color.surface : 'transparent')};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.color.accent.line : theme.color.border)};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textMuted)};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadow.xs : 'none')};

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
    color: ${({ theme }) => theme.color.text};
  }
`

const TabAmount = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`

const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${({ theme }) => theme.layout.orderPanel};
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export default function TableDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [activeBillId, setActiveBillId] = useState<string | null>(null)
  const [draft, setDraft] = useState<OrderLine[] | null>(null)
  const [guestsDraft, setGuestsDraft] = useState<number | null>(null)
  const [splitting, setSplitting] = useState(false)

  const { data: table, isLoading, error } = useTableById(id)
  const { data: categories } = useCategories()

  const categoryIds = useMemo(
    () =>
      (categories ?? []).map((category) => category.id).filter((value): value is string => !!value),
    [categories],
  )
  const { products } = useProductsByCategories(categoryIds)

  const createBill = useCreateBill(id ?? '')
  const updateBill = useUpdateBill(id ?? '')
  const deleteBill = useDeleteBill(id ?? '')
  const payBill = usePayBill(id ?? '')
  const splitBill = useSplitBill(id ?? '')

  if (!id)
    return (
      <EmptyState
        tone="danger"
        title="Missing table reference"
      />
    )
  if (isLoading) return <LoadingState label="Loading table" />
  if (error)
    return (
      <EmptyState
        tone="danger"
        title="Could not load this table"
        description={error.message}
      />
    )
  if (!table)
    return (
      <EmptyState
        tone="danger"
        title="Table not found"
      />
    )

  const bills = table.activeBills ?? []
  const currentBillId = activeBillId ?? bills[0]?.id ?? NEW_BILL
  const activeBill = bills.find((bill) => bill.id === currentBillId)
  const tableName = table.name || `Table ${table.number}`
  const isNew = !activeBill

  const savedLines: OrderLine[] = (activeBill?.products ?? []).map((line) => ({
    productId: line.productId!,
    name: line.name ?? 'Unknown product',
    unitPrice: line.unitPrice ?? 0,
    quantity: line.quantity ?? 0,
  }))

  const capacity = table.capacity ?? 4
  const savedGuests = activeBill?.guests ?? Math.min(2, capacity)
  const guests = guestsDraft ?? savedGuests

  const lines = draft ?? savedLines
  const dirty =
    (draft !== null && JSON.stringify(draft) !== JSON.stringify(savedLines)) ||
    (guestsDraft !== null && guestsDraft !== savedGuests)

  const resetDrafts = () => {
    setDraft(null)
    setGuestsDraft(null)
  }

  const selectBill = (billId: string) => {
    setActiveBillId(billId)
    resetDrafts()
  }

  const addProduct = (product: Product) => {
    setDraft((current) => {
      const base = current ?? lines
      const existing = base.find((line) => line.productId === product.id)
      if (existing) {
        return base.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        )
      }
      return [
        ...base,
        {
          productId: product.id!,
          name: product.name ?? 'Unknown product',
          unitPrice: product.price ?? 0,
          quantity: 1,
        },
      ]
    })
  }

  const changeQuantity = (productId: string, quantity: number) => {
    setDraft((current) =>
      (current ?? lines).map((line) =>
        line.productId === productId ? { ...line, quantity } : line,
      ),
    )
  }

  const removeLine = (productId: string) => {
    setDraft((current) => (current ?? lines).filter((line) => line.productId !== productId))
  }

  const payload = lines.map((line) => ({ productId: line.productId, quantity: line.quantity }))

  const save = () => {
    if (isNew) {
      createBill.mutate(
        {
          tableId: id,
          guests,
          products: payload,
          amount: 0,
          date: new Date().toISOString().slice(0, 10),
        },
        {
          onSuccess: (bill) => {
            resetDrafts()
            setActiveBillId(bill.id ?? NEW_BILL)
          },
        },
      )
      return
    }

    updateBill.mutate(
      { billId: activeBill!.id!, billData: { products: payload, guests } },
      { onSuccess: resetDrafts },
    )
  }

  return (
    <>
      <BackLink
        type="button"
        onClick={() => navigate('/tables')}
      >
        <ArrowBackIcon />
        All tables
      </BackLink>

      <PageHeader title={tableName} />

      <Tabs>
        {bills.map((bill) => (
          <Tab
            key={bill.id}
            type="button"
            $active={bill.id === currentBillId}
            onClick={() => selectBill(bill.id!)}
          >
            #{bill.id?.slice(0, 6)}
            <TabAmount>{money(bill.amount)}</TabAmount>
          </Tab>
        ))}
        <Tab
          type="button"
          $active={currentBillId === NEW_BILL}
          onClick={() => selectBill(NEW_BILL)}
        >
          <AddIcon style={{ fontSize: '1rem' }} />
          New bill
        </Tab>
      </Tabs>

      <Workspace>
        <ProductPicker
          categories={categories ?? []}
          products={products}
          onAdd={addProduct}
        />
        <OrderPanel
          reference={isNew ? 'New order' : `Order #${activeBill!.id?.slice(0, 6)}`}
          paid={activeBill?.paid ?? false}
          lines={lines}
          guests={guests}
          capacity={capacity}
          onChangeGuests={setGuestsDraft}
          dirty={dirty}
          isNew={isNew}
          isSaving={createBill.isLoading || updateBill.isLoading}
          isPaying={payBill.isLoading}
          isDeleting={deleteBill.isLoading}
          error={
            [createBill, updateBill, payBill, deleteBill].find((mutation) => mutation.isError)
              ? errorMessage(
                  [createBill, updateBill, payBill, deleteBill].find((mutation) => mutation.isError)
                    ?.error,
                )
              : null
          }
          onChangeQuantity={changeQuantity}
          onRemove={removeLine}
          onSave={save}
          onPay={() => activeBill && payBill.mutate(activeBill.id!)}
          onSplit={() => setSplitting(true)}
          onDelete={() =>
            activeBill &&
            deleteBill.mutate(activeBill.id!, {
              onSuccess: () => selectBill(NEW_BILL),
            })
          }
        />
      </Workspace>

      {splitting && activeBill && (
        <SplitBillModal
          lines={savedLines}
          isWorking={splitBill.isLoading}
          error={splitBill.isError ? errorMessage(splitBill.error) : null}
          onClose={() => {
            splitBill.reset()
            setSplitting(false)
          }}
          onConfirm={(staying, moving) =>
            splitBill.mutate(
              {
                billId: activeBill.id!,
                splitData: { splits: [{ products: staying }, { products: moving }] },
              },
              {
                onSuccess: (bills) => {
                  setSplitting(false)
                  selectBill(bills[0]?.id ?? NEW_BILL)
                },
              },
            )
          }
        />
      )}
    </>
  )
}
