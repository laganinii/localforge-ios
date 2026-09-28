import { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from 'expo-router'
import { MOCK_LEADS } from '../src/data/mockLeads'
import { Lead, LeadStatus } from '../src/types/lead'

const KEY = 'localforge_leads_v1'
const FILTERS: Array<LeadStatus | 'All'> = ['All', 'New', 'Contacted', 'Sold', 'Not Interested']

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<LeadStatus | 'All'>('All')
  const [q, setQ] = useState('')

  useEffect(() => {
    ;(async () => {
      const raw = await AsyncStorage.getItem(KEY)
      if (raw) setLeads(JSON.parse(raw))
      else { setLeads(MOCK_LEADS); await AsyncStorage.setItem(KEY, JSON.stringify(MOCK_LEADS)) }
    })()
  }, [])

  const filtered = leads.filter(l => {
    if (filter !== 'All' && l.status !== filter) return false
    if (q && !(`${l.name} ${l.address}`.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  return (
    <View style={s.root}>
      <Text style={s.h1}>Lead Finder</Text>
      <Text style={s.sub}>Cork demo · LocalForge</Text>
      <TextInput style={s.search} placeholder="Search" placeholderTextColor="#666" value={q} onChangeText={setQ} />
      <View style={s.row}>
        {FILTERS.map(f => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && s.chipOn]}>
            <Text style={{ color: filter === f ? '#D4AF37' : '#aaa', fontSize: 12 }}>{f}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Link href={`/lead/${item.id}`} asChild>
            <Pressable style={s.card}>
              <Text style={s.title}>{item.name}</Text>
              <Text style={s.meta}>{item.status} · ★ {item.rating} · {item.review_count} reviews</Text>
              <Text style={s.meta}>{item.address}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a', padding: 16 },
  h1: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sub: { color: '#9ca3af', marginBottom: 12 },
  search: { backgroundColor: '#141414', borderRadius: 10, padding: 12, color: '#fff', borderWidth: 1, borderColor: '#222', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#333' },
  chipOn: { borderColor: '#D4AF37', backgroundColor: '#2a2208' },
  card: { backgroundColor: '#121212', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  title: { color: '#fff', fontWeight: '700', fontSize: 16 },
  meta: { color: '#9ca3af', marginTop: 4, fontSize: 12 },
})
