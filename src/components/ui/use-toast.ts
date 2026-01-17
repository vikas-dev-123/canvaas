import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant } = props

    if (variant === 'destructive') {
      return sonnerToast.error(title || description || 'Error', {
        description: title ? description : undefined,
      })
    }

    return sonnerToast.success(title || description || 'Success', {
      description: title ? description : undefined,
    })
  }

  return { toast }
}
