import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

export default function TicketTracker() {
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Form fields for modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Created');
  const [rating, setRating] = useState(0);

  // Reset form when modal closes
  useEffect(() => {
    if (!modalVisible) {
      setTitle('');
      setDescription('');
      setStatus('Select Status');
      setRating(0);
      setEditingTicket(null);
    }
  }, [modalVisible]);

  // Add or edit a ticket
  const handleSave = () => {
    const newTicket = {
      id: editingTicket ? editingTicket.id : Date.now().toString(),
      title,
      description,
      status,
      rating,
    };

    if (editingTicket) {
      setTickets((prev) =>
        prev.map((ticket) => (ticket.id === editingTicket.id ? newTicket : ticket))
      );
    } else {
      setTickets((prev) => [...prev, newTicket]);
    }

    setModalVisible(false);
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setTitle(ticket.title);
    setDescription(ticket.description);
    setStatus(ticket.status);
    setRating(ticket.rating || 0);
    setModalVisible(true);
  };

  const handleDelete = (id) =>
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));

  const handleRating = (ticketId, value) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              rating: t.status === 'Completed' ? value : 0,
            }
          : t
      )
    );
  };

  const renderTicket = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      {/* Rating logic is implemented here if the ticket has the state completed!*/}
      {item.status === 'Completed' && (
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => handleRating(item.id, star)}>
              <Ionicons name={star <= item.rating? 'star':'star-outline'} size={22} color="gold" />
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={() => handleEdit(item)}>
          <Feather name="edit" size={22} color="#007AFF" />
        </Pressable>
        <Pressable onPress={() => handleDelete(item.id)}>
          <Feather name="trash-2" size={22} color="red" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}><Ionicons name="ticket-outline" size={30} color="black" /> Ticket Tracker by Mfone</Text>

      {/* Ticket List */}
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        ListEmptyComponent={
          <Text style={styles.empty}>No tickets yet. Add one below.</Text>
        }
      />

      {/* Add button */}
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={60} color="white" />
      </Pressable>

      {/* Modal for adding/editing */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>
              {editingTicket ? 'Edit Ticket' : 'New Ticket'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
              <Picker.Item label="Created" value="Created" />
              <Picker.Item label="Under Assistance" value="Under Assistance" />
              <Picker.Item label="Completed" value="Completed" />
            </Picker>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  empty: { textAlign: 'center', color: 'gray', marginTop: 40 },
  addButton: { position: 'absolute', bottom: 30, right: 20,width: 60,
  height: 60,
  backgroundColor: '#007AFF',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#555' },
  status: { marginTop: 6, fontWeight: '600' },
  starsRow: { flexDirection: 'row', marginTop: 6 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 16,
  },

  // Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 6,
  },
  inputFocused: {
    borderColor: '#007AFF',
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
},
  saveButton: { backgroundColor: '#007AFF'},
  cancelButton: { backgroundColor: '#e0e0e0'},
  saveText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
},
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
 },
});
