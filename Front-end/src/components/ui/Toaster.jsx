import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/helpers'

const ToastContext = createContext()

export const useToast = () => {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([])

	const addToast = useCallback(({ title, description, type = 'info', duration = 5000 }) => {
		const id = Math.random().toString(36).substr(2, 9)
		const toast = { id, title, description, type, duration }

		setToasts(prev => [...prev, toast])

		if (duration > 0) {
			setTimeout(() => {
				setToasts(prev => prev.filter(t => t.id !== id))
			}, duration)
		}

		return id
	}, [])

	const removeToast = useCallback((id) => {
		setToasts(prev => prev.filter(t => t.id !== id))
	}, [])

	const toast = {
		success: (title, description) => addToast({ title, description, type: 'success' }),
		error: (title, description) => addToast({ title, description, type: 'error' }),
		warning: (title, description) => addToast({ title, description, type: 'warning' }),
		info: (title, description) => addToast({ title, description, type: 'info' }),
	}

	return (
		<ToastContext.Provider value={{ toast, addToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</ToastContext.Provider>
	)
}

const ToastContainer = ({ toasts, removeToast }) => {
	if (toasts.length === 0) return null

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map(toast => (
				<Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
			))}
		</div>
	)
}

const Toast = ({ toast, onClose }) => {
	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info,
	}

	const styles = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800',
	}

	const iconStyles = {
		success: 'text-green-500',
		error: 'text-red-500',
		warning: 'text-yellow-500',
		info: 'text-blue-500',
	}

	const Icon = icons[toast.type]

	return (
		<div className={cn(
			'flex items-start p-4 rounded-lg border shadow-lg animate-slide-up min-w-[300px] max-w-md',
			styles[toast.type]
		)}>
			<Icon className={cn('w-5 h-5 mr-3 mt-0.5 flex-shrink-0', iconStyles[toast.type])} />
			<div className="flex-1">
				<h4 className="font-medium text-sm">{toast.title}</h4>
				{toast.description && (
					<p className="text-sm opacity-90 mt-1">{toast.description}</p>
				)}
			</div>
			<button
				onClick={onClose}
				className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	)
}

export const Toaster = () => {
	return <ToastProvider />
}