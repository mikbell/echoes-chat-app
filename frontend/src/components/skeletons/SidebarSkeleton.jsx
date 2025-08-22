import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingSkeleton from '../LoadingSkeleton';

const SidebarSkeleton = () => {
  const { t } = useTranslation();
  
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">{t('navigation.home')}</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        <LoadingSkeleton type="sidebar" count={8} />
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
