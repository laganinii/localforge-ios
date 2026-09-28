import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput, Linking, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Lead, LeadStatus } from '../../src/types/lead'
import { MOCK_LEADS } from '../../src/data/mockLeads'

const STORAGE_KEY = 'localforge_leads_v1'
const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Sold', 'Not Interested']

export default function LeadDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [lead, setLead] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    ;(async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      const list: Lead[] = raw ? JSON.parse(raw) : MOCK_LEADS
      const found = list.find(l => l.id === id) || null
      setLead(found)
      setNotes(found?.notes || '')
    })()
  }, [id])

  async function save(updates: Partial<Lead>) {
    if (!lead) return
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    const list: Lead[] = raw ? JSON.parse(raw) : MOCK_LEADS
    const next = list.map(l =>
      l.id === lead.id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l
    )
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    const updated = next.find(l => l.id === lead.id)!
    setLead(updated)
  }

  if (!lead) {
    return (
      <View style={styles.root}>
        <Text style={{ color: '#888' }}>Lead not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Stack.Screen options={{ title: lead.name }} />
      <Text style={styles.title}>{lead.name}</Text>
      <Text style={styles.addr}>{lead.address}</Text>
      <Text style={styles.meta}>★ {lead.rating.toFixed(1)} · {lead.review_count} reviews</Text>
      <Text style={styles.meta}>{lead.website ? `Site: ${lead.website}` : 'No website — pitch ready'}</Text>
      <View style={styles.row}>
        {lead.phone ? (
          <Pressable style={styles.btn} onPress={() => Linking.openURL(`tel:${lead.phone}`)}>
            <Text style={styles.btnText}>Call</Text>
          </Pressable>
        ) : null}
        {lead.phone ? (
          <Pressable style={styles.btnOutline} onPress={() => Linking.openURL(`sms:${lead.phone}`)}>
            <Text style={styles.btnOutlineText}>SMS</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.label}>Pipeline status</Text>
      <View style={styles.rowWrap}>
        {STATUSES.map(s => (
          <Pressable key={s} style={[styles.chip, lead.status === s && styles.chipOn]} onPress={() => save({ status: s })}>
            <Text style={[styles.chipText, lead.status === s && styles.chipTextOn]}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.notes} multiline value={notes} onChangeText={setNotes} placeholder="Call script / next step" placeholderTextColor="#555" />
      <Pressable style={styles.btn} onPress={() => { save({ notes }); Alert.alert('Saved') }}>
        <Text style={styles.btnText}>Save notes</Text>
      </Pressable>
      <Pressable style={[styles.btnOutline, { marginTop: 16 }]} onPress={() => Alert.alert('AI call script (demo)', `Hi, this is Gaj — I help ${lead.name.split(' ')[0]}-style local businesses get a fast premium website. You have ${lead.review_count} reviews and no site yet. Want a free mockup this week?`)}>
        <Text style={styles.btnOutlineText}>Generate call script</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800' },
  addr: { color: '#9ca3af', marginTop: 8 },
  meta: { color: '#6b7280', marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, marginTop: 18 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  btn: { backgroundColor: '#D4AF37', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#0a0a0a', fontWeight: '800' },
  btnOutline: { borderWidth: 1, borderColor: '#D4AF37', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnOutlineText: { color: '#D4AF37', fontWeight: '700' },
  label: { color: '#D4AF37', marginTop: 22, marginBottom: 6, fontWeight: '700' },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#141414', borderWidth: 1, borderColor: '#333' },
  chipOn: { backgroundColor: '#2a2208', borderColor: '#D4AF37' },
  chipText: { color: '#aaa', fontSize: 12 },
  chipTextOn: { color: '#D4AF37', fontWeight: '600' },
  notes: { minHeight: 100, backgroundColor: '#141414', borderRadius: 10, padding: 12, color: '#fff', borderWidth: 1, borderColor: '#222', textAlignVertical: 'top', marginBottom: 12 },
})
