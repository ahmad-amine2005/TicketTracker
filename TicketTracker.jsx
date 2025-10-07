import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function TicketTracker() {
  const [tickets, setTickets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Created");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!modalVisible) {
      setTitle("");
      setDescription("");
      setStatus("Created");
      setRating(0);
      setEditingTicket(null);
    }
  }, [modalVisible]);

  // Add or edit ticket
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
        prev.map((ticket) =>
          ticket.id === editingTicket.id ? newTicket : ticket
        )
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

  const confirmDelete = (id) => {
    setTicketToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = () => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete));
    setDeleteModalVisible(false);
    setTicketToDelete(null);
  };

  const handleRating = (ticketId, value) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, rating: t.status === "Completed" ? value : 0 }
          : t
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Created":
        return "#3B82F6";
      case "Under Assistance":
        return "#F59E0B";
      case "Completed":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const renderTicket = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.desc}>{item.description}</Text>

      {/* Rating (only if Completed) */}
      {item.status === "Completed" && (
        <View style={styles.starsRow}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingLabel}>Rate this ticket:</Text>
            {item.rating >= 0 && (
              <View style={styles.starCountContainer}>
                <Ionicons name="star" size={18} color="#FACC15" />
                <Text style={styles.starCountText}>{item.rating}/5</Text>
              </View>
            )}
          </View>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => handleRating(item.id, star)}>
                <Ionicons
                  name={star <= item.rating ? "star" : "star-outline"}
                  size={24}
                  color="#FCD34D"
                />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => handleEdit(item)}>
          <Feather name="edit" size={20} color="#3B82F6" />
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Feather name="trash-2" size={20} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="ticket-outline" size={50} color="#3B82F6" />
        <Text style={styles.header}>Ticket Tracker</Text>
      </View>
      <Text style={styles.subheader}>by Mfone Amine</Text>

      <FlatList
        style={{ flex: 1 }}
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={
          tickets.length === 0
            ? styles.emptyListContent
            : { padding: 16, paddingBottom: 100 }
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
            <Text style={styles.empty}>No tickets yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button below to start tracking your tickets.
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        android_ripple={{ color: "#1E40AF" }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>
              {editingTicket ? "Edit Ticket" : "New Ticket"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
                itemStyle={{
                  color: "#000",
                }}
              >
                <Picker.Item label="Created" value="Created" />
                <Picker.Item
                  label="Under Assistance"
                  value="Under Assistance"
                />
                <Picker.Item label="Completed" value="Completed" />
              </Picker>
            </View>

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

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIconContainer}>
              <Ionicons name="warning-outline" size={48} color="#EF4444" />
            </View>
            <Text style={styles.deleteTitle}>Delete Ticket?</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this ticket? This action cannot be
              undone.
            </Text>
            <View style={styles.deleteActions}>
              <Pressable
                style={[styles.button, styles.cancelButton, styles.flexButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.deleteButton, styles.flexButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },

  subheader: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    fontSize: 20,
    color: "#6B7280",
    marginTop: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: "#3B82F6",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    marginRight: 12,
  },
  desc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  statusText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  starsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  ratingLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 500,
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
    overflow: "hidden",
  },
  picker: {
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },
  flexButton: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  deleteMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  starCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  starCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});
