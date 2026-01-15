
import { AlertTriangle } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/button'
interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  planName: string
  isDeleting?: boolean
}
export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  planName,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Travel Plan"
      maxWidth="sm"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Are you sure?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          You are about to delete your trip to{' '}
          <span className="font-semibold text-gray-900">{planName}</span>. This
          action cannot be undone.
        </p>
        <div className="flex w-full space-x-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            className="flex-1"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            Delete Plan
          </Button>
        </div>
      </div>
    </Modal>
  )
}
