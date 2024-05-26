import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from "../../firebase/config"
import { Spin } from 'antd';
import useFilestore from '../../hooks/useFilestore';
import { AuthContext } from '../provider/AuthProvider';


export const AppContext = React.createContext();

export default function AppProvider({ children }) {
    const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);

    const { user: { uid } } = React.useContext(AuthContext);

    const roomsCondition = React.useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid,
        };
    }, [uid]);

    const rooms = useFilestore('rooms', roomsCondition);

    const selectedRoom = React.useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    );

    const usersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members,
        };
    }, [selectedRoom.members]);

    const members = useFilestore('users', usersCondition);

    // console.log({ rooms });

    return (
        <AppContext.Provider value={{
            rooms,
            selectedRoom,
            isAddRoomOpen,
            setIsAddRoomOpen,
            selectedRoomId,
            setSelectedRoomId,
            members,
            isInviteMemberOpen,
            setIsInviteMemberOpen
        }}>
            {children}
        </AppContext.Provider>
    )
}
