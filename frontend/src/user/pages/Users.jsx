import React from 'react';
import UsersList from '../components/UsersList';
import gween from '/gween.jpg';

const Users = () => {
    const USERS = [
        { id: 'u1', name: "mike schwarz", image: gween, places: 3 }
    ]
    return <UsersList items={USERS} />;
};

export default Users;