import { useAuthStore } from '../store/useAuthStore';

export function usePermissions() {
  const { user } = useAuthStore();

  const canViewReports = user?.role === 'Owner' || user?.role === 'Manager';
  const canManageStaff = user?.role === 'Owner';
  const canEditPrices = user?.role === 'Owner';

  return { canViewReports, canManageStaff, canEditPrices };
}
