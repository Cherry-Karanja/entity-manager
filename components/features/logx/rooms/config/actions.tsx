/**
 * Room Action Configurations
 * 
 * Defines actions available for room management.
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Room } from '../../types';
import { roomsApiClient } from '../api/client';
import { 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Download,
  Calendar
} from 'lucide-react';

export const RoomActionsConfig: EntityActionsConfig<Room> = {
  actions: [
    // ===========================
    // Single Item Actions
    // ===========================
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      actionType: 'navigation',
      position: 'row',
      url: (room?: Room) => `/dashboard/rooms/${room!.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      actionType: 'navigation',
      position: 'row',
      url: (room?: Room) => `/dashboard/rooms/${room!.id}/edit`,
    },
    {
      id: 'activate',
      label: 'Activate',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'primary',
      position: 'row',
      visible: (room?: Room) => !room?.is_active,
      confirmMessage: (room?: Room) =>
        `Are you sure you want to activate "${room?.name}"?`,
      confirmText: 'Activate',
      onConfirm: async (room?: Room, context?) => {
        if (!room || !context?.refresh) return;
        try {
          await roomsApiClient.update(room.id, { is_active: true });
          await context.refresh();
        } catch (error) {
          console.error('Failed to activate room:', error);
        }
      },
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'secondary',
      position: 'row',
      visible: (room?: Room) => room?.is_active === true,
      confirmMessage: (room?: Room) =>
        `Are you sure you want to deactivate "${room?.name}"?`,
      confirmText: 'Deactivate',
      onConfirm: async (room?: Room, context?) => {
        if (!room || !context?.refresh) return;
        try {
          await roomsApiClient.update(room.id, { is_active: false });
          await context.refresh();
        } catch (error) {
          console.error('Failed to deactivate room:', error);
        }
      },
    },
    {
      id: 'viewTimetables',
      label: 'View Timetables',
      icon: <Calendar className="h-4 w-4" />,
      actionType: 'navigation',
      position: 'row',
      variant: 'outline',
      url: (room?: Room) => `/dashboard/timetables?room=${room!.id}`,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'confirm',
      variant: 'destructive',
      position: 'row',
      confirmMessage: (room?: Room) => 
        `Are you sure you want to delete "${room?.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      onConfirm: async (room?: Room, context?) => {
        if (!room || !context?.refresh) return;
        try {
          await roomsApiClient.delete(room.id);
          await context.refresh();
        } catch (error) {
          console.error('Failed to delete room:', error);
        }
      },
    },

    // ===========================
    // Bulk Actions
    // ===========================
    {
      id: 'bulkActivate',
      label: 'Activate Selected',
      icon: <CheckCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'primary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to activate ${count} room(s)?`,
      handler: async (rooms: Room[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            rooms.map(room => roomsApiClient.update(room.id, { is_active: true }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk activate:', error);
        }
      },
    },
    {
      id: 'bulkDeactivate',
      label: 'Deactivate Selected',
      icon: <XCircle className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'secondary',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to deactivate ${count} room(s)?`,
      handler: async (rooms: Room[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(
            rooms.map(room => roomsApiClient.update(room.id, { is_active: false }))
          );
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk deactivate:', error);
        }
      },
    },
    {
      id: 'bulkDelete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      actionType: 'bulk',
      variant: 'destructive',
      position: 'toolbar',
      confirmBulk: true,
      bulkConfirmMessage: (count: number) => 
        `Are you sure you want to delete ${count} room(s)? This action cannot be undone.`,
      handler: async (rooms: Room[], context) => {
        if (!context?.refresh) return;
        try {
          await Promise.all(rooms.map(room => roomsApiClient.delete(room.id)));
          await context.refresh();
        } catch (error) {
          console.error('Failed to bulk delete:', error);
        }
      },
    },

    // ===========================
    // Global Actions
    // ===========================
    {
      id: 'exportRooms',
      label: 'Export',
      icon: <Download className="h-4 w-4" />,
      actionType: 'download',
      variant: 'secondary',
      position: 'toolbar',
      handler: async () => {
        console.log('Exporting rooms');
        // Export handled by EntityManager exporter
      },
    },
  ],
  mode: 'dropdown',
  className: '',
};

// Legacy export for backward compatibility
export const roomActions = RoomActionsConfig;
export const roomActionsConfig = RoomActionsConfig;
