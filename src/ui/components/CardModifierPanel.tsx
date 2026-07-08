/**
 * Card Modifier Panel
 * Shows active modifiers and allows playing new cards
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { CardModifier } from '../../types/game';

interface CardModifierPanelProps {
  activeModifiers: CardModifier[];
  availableCards: Omit<CardModifier, 'id' | 'isExpired' | 'targetPlayerId'>[];
  onPlayCard: (cardTemplate: Omit<CardModifier, 'id' | 'isExpired' | 'targetPlayerId'>) => void;
  onExpireModifier: (modifierId: string) => void;
}

export function CardModifierPanel({
  activeModifiers,
  availableCards,
  onPlayCard,
  onExpireModifier,
}: CardModifierPanelProps) {
  return (
    <View style={styles.container}>
      {/* Active modifiers */}
      {activeModifiers.length > 0 && (
        <View style={styles.activeSection}>
          <Text style={styles.sectionTitle}>ACTIVE MODIFIERS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeModifiers.map((modifier) => (
              <View
                key={modifier.id}
                style={[
                  styles.activeCard,
                  modifier.isExpired && styles.activeCardExpired,
                ]}
              >
                <Text style={styles.activeCardName}>{modifier.name}</Text>
                <Text style={styles.activeCardTiming}>
                  {modifier.timingWindow === 'immediateShot' && '⚡ Next shot'}
                  {modifier.timingWindow === 'currentHole' && '🎯 This hole'}
                  {modifier.timingWindow === 'endOfRound' && '🏁 End round'}
                </Text>
                {!modifier.isExpired && (
                  <TouchableOpacity
                    style={styles.expireButton}
                    onPress={() => onExpireModifier(modifier.id)}
                  >
                    <Text style={styles.expireButtonText}>✓</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Available cards to play */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>PLAY CARD</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => onPlayCard(card)}
            >
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardMetaText}>
                  {card.targetVector === 'single' && '👤 Single'}
                  {card.targetVector === 'opponent' && '⚔️ Opponent'}
                  {card.targetVector === 'all' && '👥 All'}
                </Text>
                <Text style={styles.cardMetaText}>
                  {card.engineModification === 'forceRetake' && '🔄 Retake'}
                  {card.engineModification === 'addStroke' && '+1'}
                  {card.engineModification === 'freezePayout' && '❄️ Freeze'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  activeSection: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cardsSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.neonYellow,
    marginBottom: theme.spacing.sm,
  },
  activeCard: {
    backgroundColor: '#111100',
    borderWidth: 2,
    borderColor: theme.colors.neonYellow,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    minWidth: 150,
  },
  activeCardExpired: {
    opacity: 0.5,
    borderColor: theme.colors.border,
  },
  activeCardName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  activeCardTiming: {
    ...theme.typography.caption,
    color: theme.colors.neonYellow,
  },
  expireButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expireButtonText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: theme.colors.border,
    borderWidth: 2,
    borderColor: theme.colors.neonPurple,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    width: 200,
  },
  cardName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMetaText: {
    ...theme.typography.caption,
    color: theme.colors.neonPurple,
  },
});
