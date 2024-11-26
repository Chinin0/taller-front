import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useLocation } from 'react-router-dom';
import './css/SidebarLayout.css';

const SidebarLayout = ({ children }) => {
    const location = useLocation(); // Para resaltar el ítem activo
    const [openMenus, setOpenMenus] = useState({}); // Estado para manejar múltiples menús

    // Alternar el estado de un menú colapsable
    const handleToggle = (menu) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    // Datos para el menú lateral
    const menuItems = [
        { 
            text: 'Inicio', 
            icon: <HomeIcon />, 
            path: '/' 
        },
        { 
            text: 'Clientes', 
            icon: <PeopleIcon />, 
            children: [
                { text: 'Listar Clientes', path: '/list-client', icon: <FormatListBulletedIcon /> },
                { text: 'Crear Cliente', path: '/create-client', icon: <PersonAddIcon /> },
            ],
        },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Menú lateral */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#f7f9fc', // Fondo claro
                    },
                }}
            >
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem 
                                button 
                                component={item.path ? Link : 'div'} 
                                to={item.path || undefined}
                                onClick={() => item.children && handleToggle(item.text)}
                                className={location.pathname === item.path ? 'active-item' : ''}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.children && (openMenus[item.text] ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>
                            {item.children && (
                                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child, childIndex) => (
                                            <ListItem
                                                key={childIndex}
                                                button
                                                component={Link}
                                                to={child.path}
                                                className={location.pathname === child.path ? 'active-item' : ''}
                                                sx={{ pl: 4 }} // Padding para submenús
                                            >
                                                <ListItemIcon>{child.icon}</ListItemIcon>
                                                <ListItemText primary={child.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>

            {/* Contenido principal */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

export default SidebarLayout;
