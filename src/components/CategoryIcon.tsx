import React from 'react';
import {
  Axe,
  BugOff,
  Droplets,
  Fence,
  FileText,
  Layers,
  Leaf,
  PackagePlus,
  Scissors,
  ShieldAlert,
  Shovel,
  Sprout,
  TreePalm,
  Trees,
  Truck,
  Users,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'TreePalm':
      return <TreePalm className={className} />;
    case 'Axe':
      return <Axe className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'Shovel':
      return <Shovel className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Leaf':
      return <Leaf className={className} />;
    case 'PackagePlus':
      return <PackagePlus className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Fence':
      return <Fence className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'BugOff':
      return <BugOff className={className} />;
    case 'Users':
      return <Users className={className} />;
    default:
      return <FileText className={className} />;
  }
};
