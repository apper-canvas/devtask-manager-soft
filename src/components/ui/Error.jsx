import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-mono font-semibold text-white mb-2">Oops!</h3>
        <p className="text-gray-400 mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default Error