import { MenuGroupInterface } from './menu-group.interface';
import { MenuCollapseInterface } from './menu-collapse.interface';
import { MenuIntemInterface } from './menu-intem.interface';

export class AppNavigationModel {

    public model: (MenuGroupInterface | MenuCollapseInterface | MenuIntemInterface)[];

    constructor(rol?: string, modules?: Array<any>) {
        if (rol === 'Inversionista') {
            this.model = [
                {
                    id: 'menu',
                    title: 'MENÚ',
                    type: 'group',
                    icon: '',
                    children: [
                        {
                            id   : 'investment',
                            title: 'Inversiones',
                            type : 'item',
                            url  : 'investment',
                            icon: 'iconInversiont',
                            iconCustom: true
                        },
                        {
                            id   : 'profile',
                            title: 'Mi Perfil',
                            type : 'item',
                            url  : 'my-profile',
                            icon: 'logoProfile',
                            iconCustom: true
                        },
                        {
                            id   : 'technicalsupport',
                            title: 'Soporte Técnico',
                            type : 'item',
                            url  : 'technical-support',
                            icon: 'iconTechnicalSupport',
                            iconCustom: true
                        },
                        {
                            id   : 'settings',
                            title: 'Ajustes',
                            type : 'item',
                            url  : 'settings',
                            icon: 'iconSettings',
                            iconCustom: true
                        }
                    ]
                }
            ];
        } else if (rol === 'License') {
            this.model = [
                {
                    id: 'menu',
                    title: 'MENÚ',
                    type: 'group',
                    icon: '',
                    children: [
                        {
                            id: 'license',
                            title: 'Licencia',
                            type: 'item',
                            url: 'licencias',
                            icon: 'vpn_key',
                            iconCustom: false
                        }
                    ]
                }
            ];
        } else if (rol === 'Acreditado') {
            this.model = [
                {
                    id: 'menu',
                    title: 'MENÚ',
                    type: 'group',
                    icon: '',
                    children: [
                        {
                            id   : 'my-advance',
                            title: 'Adelantos',
                            type : 'item',
                            url  : 'solicitar-adelanto',
                            icon: 'iconInversiont',
                            iconCustom: true
                        },
                        {
                            id   : 'technicalsupport',
                            title: 'Soporte Técnico',
                            type : 'item',
                            url  : 'technical-support',
                            icon: 'iconTechnicalSupport',
                            iconCustom: true
                        },
                        {
                            id   : 'settings',
                            title: 'Ajustes',
                            type : 'item',
                            url  : 'settings',
                            icon: 'iconSettings',
                            iconCustom: true
                        }
                    ]
                }
            ];
        } else {

            if (!!!modules) {
                modules = [];
            }

            const menuUser: any = [];
            const allMenus: any = [
                {
                    id   : 'dashboard',
                    title: 'Dashboard',
                    type : 'item',
                    url  : '/dashboard',
                    icon: 'logoDashboard',
                    iconCustom: true
                }
            ];

            if (modules.some(item => item.Module === 'Crear Usuario' || item.module === 'Crear Usuario')) {
                menuUser.push({
                    id   : 'create-user',
                    title: 'Crear Usuario',
                    type : 'item',
                    url  : 'users/create-users'
                });
            }

            if (modules.some(item => item.Module === 'Inversionistas' || item.module === 'Inversionistas')) {
                menuUser.push({
                    id   : 'inversionistas',
                    title: 'Inversionistas',
                    type : 'item',
                    url  : 'users/investor'
                });
            }

            if (modules.some(item => item.Module === 'Acreditados' || item.module === 'Acreditados')) {
                menuUser.push({
                    id   : 'acredited',
                    title: 'Acreditados',
                    type : 'item',
                    url  : 'users/accredited'
                });
            }

            if (modules.some(item => item.Module === 'Administradores' || item.module === 'Administradores')) {
                menuUser.push({
                    id   : 'administrator',
                    title: 'Administradores',
                    type : 'item',
                    url  : 'users/administrator'
                });

                allMenus.push({
                    id: 'license',
                    title: 'Licencia',
                    type: 'item',
                    url: 'licencias',
                    icon: 'vpn_key',
                    iconCustom: false,
                }, {
                    id: 'pending-record',
                    title: 'Solicitudes',
                    type: 'item',
                    url: 'registros-pendientes',
                    icon: 'group_add',
                    iconCustom: false,
                }, {
                    id: 'pending-record-not-found',
                    title: 'Accreditados Sin Curp',
                    type: 'item',
                    url: 'registros-sin-rfc',
                    icon: 'group_add',
                    iconCustom: false,
                });
            }

            if (menuUser.length > 0) {
                allMenus.push({
                    id: 'users',
                    title: 'Usuarios',
                    type: 'collapse',
                    icon: 'logoUsers',
                    iconCustom: true,
                    children: menuUser
                });
            }

            if (modules.some(item => item.Module === 'Control de Fondeo' || item.module === 'Control de Fondeo')) {
                allMenus.push({
                    id   : 'control-fondeo',
                    title: 'Control de Fondeo',
                    type : 'item',
                    url  : 'fondeo-control',
                    icon: 'logoControls',
                    iconCustom: true
                });
            }

            if (modules.some(item => item.Module === 'Adelantos Por Cobrar' || item.module === 'Adelantos Por Cobrar')) {
                allMenus.push({
                    id   : 'advance-paymed',
                    title: 'Adelantos por Cobrar',
                    type : 'item',
                    url  : 'advances-receivable',
                    icon: 'logoAdvance',
                    iconCustom: true
                });
            }

            allMenus.push(
                {
                    id   : 'technicalsupport',
                    title: 'Soporte Técnico',
                    type : 'item',
                    url  : 'technical-support',
                    icon: 'iconTechnicalSupport',
                    iconCustom: true
                },
                {
                    id   : 'settings',
                    title: 'Ajustes',
                    type : 'item',
                    url  : 'settings',
                    icon: 'iconSettings',
                    iconCustom: true
                }
            );

            this.model = [
                {
                    id: 'menu',
                    title: 'MENÚ',
                    type: 'group',
                    icon: '',
                    children: allMenus
                }
            ];
        }
    }
}
