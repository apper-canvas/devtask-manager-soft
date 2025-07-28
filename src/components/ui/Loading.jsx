import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Code2" size={16} className="text-primary" />
        </div>
      </div>
      <p className="text-gray-400 font-medium">{message}</p>
    </div>
  )
}

export default Loading