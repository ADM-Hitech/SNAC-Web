export interface Alert {
    id: number;
    icon: 'error' | 'warning' | 'done' | 'info';
    title: string;
    message: string;
    data: any;
    shown: boolean;
}
