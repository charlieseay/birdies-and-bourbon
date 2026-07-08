/**
 * Custom Game Builder Screen
 * Workshop for creating custom decks, chips, and cards
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { GameDeck, Chip, CardModifier } from '../../types/game';
import { generateUUID } from '../../utils/uuid';

interface CustomGameScreenProps {
  onSaveDeck: (deck: GameDeck) => void;
  onBack: () => void;
}

export function CustomGameScreen({ onSaveDeck, onBack }: CustomGameScreenProps) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [cards, setCards] = useState<Omit<CardModifier, 'id' | 'isExpired' | 'targetPlayerId'>[]>([]);

  const addChip = () => {
    const newChip: Chip = {
      id: `chip-${generateUUID()}`,
      name: 'New Chip',
      type: 'negative',
      weight: 1,
      icon: '•',
    };
    setChips([...chips, newChip]);
  };

  const addCard = () => {
    const newCard = {
      name: 'New Card',
      description: 'Card description',
      timingWindow: 'currentHole' as const,
      targetVector: 'single' as const,
      engineModification: 'addStroke' as const,
    };
    setCards([...cards, newCard]);
  };

  const handleSave = () => {
    if (!deckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    const deck: GameDeck = {
      id: `custom-${generateUUID()}`,
      name: deckName.trim(),
      description: deckDescription.trim() || 'Custom game deck',
      isCustom: true,
      chips,
      cardTemplates: cards,
    };

    onSaveDeck(deck);
    Alert.alert('Success', 'Custom deck saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CUSTOM GAME BUILDER</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Deck Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deck Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Deck Name"
            placeholderTextColor={theme.colors.textDisabled}
            value={deckName}
            onChangeText={setDeckName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={theme.colors.textDisabled}
            value={deckDescription}
            onChangeText={setDeckDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chips ({chips.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addChip}>
              <Text style={styles.addButtonText}>+ ADD CHIP</Text>
            </TouchableOpacity>
          </View>

          {chips.map((chip, index) => (
            <View key={chip.id} style={styles.itemCard}>
              <Text style={styles.itemTitle}>Chip #{index + 1}</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="Name"
                placeholderTextColor={theme.colors.textDisabled}
                value={chip.name}
                onChangeText={(text) => {
                  const updated = [...chips];
                  updated[index].name = text;
                  setChips(updated);
                }}
              />
              <Text style={styles.label}>Type: {chip.type}</Text>
              <Text style={styles.label}>Weight: ${chip.weight}</Text>
            </View>
          ))}
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cards ({cards.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addCard}>
              <Text style={styles.addButtonText}>+ ADD CARD</Text>
            </TouchableOpacity>
          </View>

          {cards.map((card, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>Card #{index + 1}</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="Name"
                placeholderTextColor={theme.colors.textDisabled}
                value={card.name}
                onChangeText={(text) => {
                  const updated = [...cards];
                  updated[index].name = text;
                  setCards(updated);
                }}
              />
              <TextInput
                style={[styles.smallInput, styles.textArea]}
                placeholder="Description"
                placeholderTextColor={theme.colors.textDisabled}
                value={card.description}
                onChangeText={(text) => {
                  const updated = [...cards];
                  updated[index].description = text;
                  setCards(updated);
                }}
                multiline
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE DECK</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    ...theme.typography.body,
    color: theme.colors.neonCyan,
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonGreen,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.border,
    color: theme.colors.textPrimary,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: theme.colors.neonGreen,
    borderRadius: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  addButtonText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: '700',
  },
  itemCard: {
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  itemTitle: {
    ...theme.typography.body,
    color: theme.colors.neonPurple,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  smallInput: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    borderRadius: 4,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  saveButton: {
    backgroundColor: theme.colors.neonGreen,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  saveButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
});
