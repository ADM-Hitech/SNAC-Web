import { MenuIntemInterface } from './menu-intem.interface';

export interface MenuCollapseInterface {
    id: string;
    title: string;
    badge?: {
        quantity: number
    };
    translate?: string;
    type: 'collapse';
    icon?: string; // references icon material
    iconCustom?: boolean;
    children: MenuIntemInterface[];
}
