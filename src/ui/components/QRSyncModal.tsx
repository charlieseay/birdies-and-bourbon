/**
 * QR Sync Modal
 * Shows QR code for peer-to-peer scorecard sync
 */

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../theme';
import { RoundState } from '../../types/game';
import { roundStateToQrString } from '../../utils/qrSync';

interface QRSyncModalProps {
  visible: boolean;
  roundState: RoundState;
  onClose: () => void;
}

export function QRSyncModal({ visible, roundState, onClose }: QRSyncModalProps) {
  const qrData = roundStateToQrString(roundState);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>SYNC SCORECARD</Text>
          <Text style={styles.instructions}>
            Scan this QR code with another device to sync the scorecard
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={250}
              color={theme.colors.textPrimary}
              backgroundColor={theme.colors.background}
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>
              Hole: {roundState.currentHoleIndex + 1} of {roundState.holes.length}
            </Text>
            <Text style={styles.infoText}>
              Players: {Object.keys(roundState.players).length}
            </Text>
            <Text style={styles.infoText}>
              Data size: {qrData.length} bytes
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.neonCyan,
    padding: theme.spacing.xl,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.neonCyan,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  instructions: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  qrContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 8,
    marginBottom: theme.spacing.lg,
  },
  info: {
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  closeButton: {
    backgroundColor: theme.colors.neonCyan,
    borderRadius: 8,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...theme.typography.button,
    color: theme.colors.background,
    fontWeight: '700',
  },
});
