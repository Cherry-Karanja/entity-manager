import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ComponentType<{ item: unknown; onClose: () => void }>;
  footer?: React.ReactNode | ((item: unknown) => React.ReactNode);
  width?: string | number;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  item: unknown;
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onClose,
  title,
  content: ContentComponent,
  footer,
  width = 378,
  placement = 'right',
  item,
}) => {
  const renderFooter = () => {
    if (!footer) {
      return (
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      );
    }

    if (typeof footer === 'function') {
      return <DrawerFooter>{footer(item)}</DrawerFooter>;
    }

    return <DrawerFooter>{footer}</DrawerFooter>;
  };

  const getPlacementClass = () => {
    switch (placement) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      case 'top':
        return 'top-0';
      case 'bottom':
        return 'bottom-0';
      default:
        return 'right-0';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className={cn(
          "h-full",
          getPlacementClass(),
          // Responsive width for mobile
          "w-full sm:w-auto"
        )}
        style={{
          width: typeof width === 'number' ? `${Math.min(width, window.innerWidth)}px` : width,
          maxWidth: '100vw'
        }}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">
          <ContentComponent item={item} onClose={onClose} />
        </div>
        {renderFooter()}
      </DrawerContent>
    </Drawer>
  );
};