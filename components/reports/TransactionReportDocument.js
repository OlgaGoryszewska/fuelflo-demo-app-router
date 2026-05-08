import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 32,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: 700,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  label: {
    width: '38%',
    fontWeight: 700,
    color: '#333333',
  },
  value: {
    width: '62%',
    color: '#111111',
  },
  metricBox: {
    marginTop: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
  },
  metricText: {
    fontSize: 16,
    fontWeight: 700,
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  imageCard: {
    width: '48%',
  },
  imageTitle: {
    marginBottom: 6,
    fontSize: 10,
    fontWeight: 700,
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 32,
    right: 32,
    textAlign: 'center',
    fontSize: 9,
    color: '#777777',
  },
});

function formatDate(dateValue) {
  if (!dateValue) return '-';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shortId(value) {
  if (!value) return '-';
  return value.length > 8 ? `${value.slice(0, 8)}...` : value;
}

export default function TransactionReportDocument({ transaction }) {
  const beforeFuel = toNumber(transaction.before_fuel_level);
  const afterFuel = toNumber(transaction.after_fuel_level);
  const difference = Math.abs(afterFuel - beforeFuel);
  const sign = transaction.type === 'delivery' ? '+' : '-';

  return (
    <Document
      title={`Transaction Report ${transaction.id}`}
      author="Your App"
      subject="Fuel transaction report"
      creator="Your App"
      producer="react-pdf"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.title}>Fuel Transaction Report</Text>
          <Text style={styles.subtitle}>
            Transaction #{shortId(transaction.id)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{transaction.id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{transaction.type || '-'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{transaction.status || '-'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>
              {formatDate(transaction.created_at)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Completed</Text>
            <Text style={styles.value}>
              {formatDate(transaction.completed_at)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Resources</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Project</Text>
            <Text style={styles.value}>
              {transaction.projects?.name || shortId(transaction.project_id)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Generator</Text>
            <Text style={styles.value}>
              {transaction.generators?.name ||
                shortId(transaction.generator_id)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tank</Text>
            <Text style={styles.value}>
              {transaction.tanks?.name || shortId(transaction.tank_id)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Technician ID</Text>
            <Text style={styles.value}>
              {shortId(transaction.technician_id)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuel Levels</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Before fuel level</Text>
            <Text style={styles.value}>{beforeFuel.toFixed(2)} L</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>After fuel level</Text>
            <Text style={styles.value}>{afterFuel.toFixed(2)} L</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricText}>
              Difference: {sign} {difference.toFixed(2)} L
            </Text>
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Transaction Photos</Text>

          <View style={styles.imageGrid}>
            <View style={styles.imageCard}>
              <Text style={styles.imageTitle}>Before transaction</Text>
              {transaction.before_photo_url ? (
                <Image
                  alt="Before transaction"
                  src={transaction.before_photo_url}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No before photo</Text>
                </View>
              )}
            </View>

            <View style={styles.imageCard}>
              <Text style={styles.imageTitle}>After transaction</Text>
              {transaction.after_photo_url ? (
                <Image
                  alt="After transaction"
                  src={transaction.after_photo_url}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No after photo</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Generated report • Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
