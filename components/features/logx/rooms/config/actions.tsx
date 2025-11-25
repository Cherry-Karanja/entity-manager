/**
 * Room Actions Configuration
 * Defines actions available for rooms
 */

import { ActionConfig } from '@/components/entityManager';
import { Room } from '../../types';
import { roomsClient } from '../api/client';
import { Edit, Trash2, Eye, Power, PowerOff } from 'lucide-react';

export const roomActions: ActionConfig<Room> = {
  row: [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      actionType: 'navigation',
      href: (room) => `/dashboard/rooms/${room.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      actionType: 'navigation',
      href: (room) => `/dashboard/rooms/${room.id}/edit`,
    },
    {
      id: 'toggle-active',
      label: (room) => room.is_active ? 'Deactivate' : 'Activate',
      icon: (room) => room.is_active ? PowerOff : Power,
      actionType: 'confirm',
      confirmTitle: (room) => room.is_active ? 'Deactivate Room' : 'Activate Room',
      confirmMessage: (room) => 
        room.is_active 
          ? `Are you sure you want to deactivate "${room.name}"? This will make it unavailable for scheduling.`
          : `Are you sure you want to activate "${room.name}"? This will make it available for scheduling.`,
      onConfirm: async (room) => {
        await roomsClient.update(room.id, { is_active: !room.is_active } as Partial<Room>);
      },
      variant: (room) => room.is_active ? 'destructive' : 'default',
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      actionType: 'confirm',
      confirmTitle: 'Delete Room',
      confirmMessage: (room) => `Are you sure you want to delete "${room.name}"? This action cannot be undone.`,
      onConfirm: async (room) => {
        await roomsClient.delete(room.id);
      },
      variant: 'destructive',
    },
  ],
  bulk: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      icon: Power,
      actionType: 'bulk',
      onBulkAction: async (rooms) => {
        await Promise.all(
          rooms.map(room => roomsClient.update(room.id, { is_active: true } as Partial<Room>))
        );
      },
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      icon: PowerOff,
      actionType: 'bulk',
      onBulkAction: async (rooms) => {
        await Promise.all(
          rooms.map(room => roomsClient.update(room.id, { is_active: false } as Partial<Room>))
        );
      },
      variant: 'destructive',
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: Trash2,
      actionType: 'bulk',
      onBulkAction: async (rooms) => {
        await Promise.all(rooms.map(room => roomsClient.delete(room.id)));
      },
      variant: 'destructive',
      requireConfirm: true,
      confirmMessage: (rooms) => `Are you sure you want to delete ${rooms.length} rooms? This action cannot be undone.`,
    },
  ],
};
