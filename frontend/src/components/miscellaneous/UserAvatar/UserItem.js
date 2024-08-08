import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      width="100%"
      display="flex"
      cursor="pointer"
      p={2}
      alignItems="center"
      _hover={{ background: '#77cbd6' }}
      borderRadius="lg"
      bg="#eaf2f3e6"
      mb={2}
    >
      <Avatar
        size="sm"
        cursor="pointer"
        alt={user.name}
        src={user.pic}
      ></Avatar>
      <Box mx={5}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserItem;
