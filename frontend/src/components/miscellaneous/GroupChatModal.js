import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserItem from './UserAvatar/UserItem';
import UserItemBadge from './UserAvatar/UserItemBadge';
import { useNavigate } from 'react-router-dom';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const handleSearch = async query => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error occured',
        status: 'error',
        description: 'Failed to search',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  //used to select members of group
  const handleGroup = userToAdd => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = delUser => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== delUser._id));
  };
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      if (selectedUsers.length < 2) {
        toast({
          title: 'Select atleast two members',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else
        toast({
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
    } else {
      try {
        const config = {
          headers: {
            Authorization: `bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          '/api/chat/group',
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map(u => u._id)),
          },
          config
        );
        //chats get udated and gpchat is at first
        setChats([data, ...chats]);
        onClose();
        setSelectedUsers([]);

        //when navigating to /home it redirects /chats becsuse of bellow code in HomePage
        //         if (userinfo) {
        //   navigate('/chats');
        //   console.log(navigate, 'loggedin');
        // navigate('/home');
        //navigate /chats is not used because the variables get null on loading
        toast({
          title: 'Group Chat created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      } catch (error) {
        toast({
          title: 'Failed to create chat',
          status: 'warning',
          description: error.response.data,
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  return (
    <>
      {/* the button that is wrapped is children */}
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {selectedUsers?.map((u, i) => (
                  <UserItemBadge
                    key={u._id}
                    user={u}
                    index={i}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              <Input
                type="text"
                placeholder="Add Users eg:John, Sappy"
                onChange={e => handleSearch(e.target.value)}
                mb={3}
              />

              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spinner
                    thickness="3px"
                    speed="0.6s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  />
                </div>
              ) : (
                //slice to display first 4 searchResult
                searchResult?.slice(0, 4).map(user => (
                  <UserItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleGroup(user);
                    }}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
