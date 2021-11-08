export interface MenuIntemInterface {
    id: string;
    title: string;
    badge?: {
        quantity: number
    };
    translate?: string;
    type: 'item';
    icon?: string; // references icon material
    iconCustom?: boolean;
    url?: string;
    function?: any;
}
