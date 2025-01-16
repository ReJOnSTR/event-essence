import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const Icon = variant === 'destructive' ? XCircle :
                    variant === 'success' ? CheckCircle2 :
                    variant === 'warning' ? AlertCircle :
                    variant === 'info' ? Info :
                    Info;

        return (
          <Toast key={id} {...props} variant={variant} className="group">
            <div className="flex gap-3">
              <Icon className="h-5 w-5 mt-1" />
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}