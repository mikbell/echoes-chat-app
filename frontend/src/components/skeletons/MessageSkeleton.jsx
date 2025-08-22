import LoadingSkeleton from '../LoadingSkeleton';

const MessageSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <LoadingSkeleton type="message" count={6} />
    </div>
  );
};

export default MessageSkeleton;
