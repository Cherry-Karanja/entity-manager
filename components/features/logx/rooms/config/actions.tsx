/**
 * Room Actions Configuration
 * Defines actions available for rooms
 */

import { EntityActionsConfig } from '@/components/entityManager/composition/config/types';
import { Room } from '../../types';
import { roomsClient } from '../api/client';
import { Edit, Trash2, Eye, Power, PowerOff } from 'lucide-react';

export const roomActions: EntityActionsConfig<Room> = {
  actions: [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      actionType: 'navigation',
      position: 'row',
      url: (room?: Room) => `/dashboard/rooms/${room!.id}`,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      actionType: 'navigation',
      position: 'row',
      url: (room?: Room) => `/dashboard/rooms/${room!.id}/edit`,
    },
    {
      id: 'toggle-active',
      label: 'Toggle Active',
      icon: Power,
      actionType: 'confirm',
      position: 'row',
      confirmTitle: 'Toggle Room Active State',
      confirmMessage: (room?: Room) =>
        `Are you sure you want to toggle active state for "${room!.name}"?`,
      onConfirm: async (room?: Room) => {
        await roomsClient.update(room!.id, { is_active: !room!.is_active } as Partial<Room>);
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      actionType: 'confirm',
      position: 'row',
      confirmTitle: 'Delete Room',
      confirmMessage: (room?: Room) => `Are you sure you want to delete "${room!.name}"? This action cannot be undone.`,
      onConfirm: async (room?: Room) => {
        await roomsClient.delete(room!.id);
      },
      variant: 'destructive',
    },
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      icon: Power,
      actionType: 'bulk',
      position: 'toolbar',
      handler: async (rooms: Room[]) => {
        await Promise.all(
          rooms.map((room: Room) => roomsClient.update(room.id, { is_active: true } as Partial<Room>))
        );
      },
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      icon: PowerOff,
      actionType: 'bulk',
      position: 'toolbar',
      handler: async (rooms: Room[]) => {
        await Promise.all(
          rooms.map((room: Room) => roomsClient.update(room.id, { is_active: false } as Partial<Room>))
        );
      },
      variant: 'destructive',
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: Trash2,
      actionType: 'bulk',
      position: 'toolbar',
      handler: async (rooms: Room[]) => {
        await Promise.all(rooms.map((room: Room) => roomsClient.delete(room.id)));
      },
      variant: 'destructive',
      requireConfirm: true,
      confirmMessage: (rooms?: Room[]) => `Are you sure you want to delete ${rooms?.length ?? 0} rooms? This action cannot be undone.`,
    },
  ],
};
