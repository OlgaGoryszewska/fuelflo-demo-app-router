import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    backgroundColor: '#FFFFFF',
    color: '#171E2C',
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
  },
  eyebrow: {
    color: '#F25822',
    fontSize: 9,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    marginBottom: 4,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 10,
    color: '#62748E',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metric: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8EDF3',
    borderRadius: 5,
    backgroundColor: '#F8FBFF',
  },
  metricLabel: {
    fontSize: 9,
    color: '#62748E',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 5,
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
    width: '34%',
    fontWeight: 700,
    color: '#475569',
  },
  value: {
    width: '66%',
    color: '#111827',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D9E2EC',
    paddingBottom: 5,
    marginBottom: 5,
    color: '#62748E',
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    paddingVertical: 6,
  },
  colDate: { width: '23%' },
  colType: { width: '16%' },
  colAsset: { width: '25%' },
  colFuel: { width: '18%', textAlign: 'right' },
  colStatus: { width: '18%', textAlign: 'right' },
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

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLitres(value) {
  return `${toNumber(value).toFixed(0)} L`;
}

function formatMoney(value) {
  return `${toNumber(value).toFixed(2)} SAR`;
}

function formatDate(dateValue) {
  if (!dateValue) return '-';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function movement(transaction) {
  const beforeFuel = Number(transaction.before_fuel_level);
  const afterFuel = Number(transaction.after_fuel_level);

  if (!Number.isFinite(beforeFuel) || !Number.isFinite(afterFuel)) {
    return 'Pending';
  }

  const sign = transaction.type === 'delivery' ? '+' : '-';
  return `${sign}${Math.abs(afterFuel - beforeFuel).toFixed(2)} L`;
}

function assetName(transaction) {
  return (
    transaction.generators?.name ||
    transaction.tanks?.name ||
    transaction.generator_id ||
    transaction.tank_id ||
    '-'
  );
}

export default function ProjectReportDocument({
  project,
  summary,
  transactions = [],
  showFinancials = true,
}) {
  const deliveredLitres = toNumber(summary?.totalDeliveredLitres);
  const returnedLitres = toNumber(summary?.totalReturnedLitres);
  const netUsedLitres = deliveredLitres - returnedLitres;
  const purchasePrice = toNumber(project.amount);
  const sellingPrice = toNumber(project.selling_price);
  const revenue = netUsedLitres * sellingPrice;
  const deliveredCost = deliveredLitres * purchasePrice;
  const grossMargin = revenue - deliveredCost;

  return (
    <Document
      title={`Project Report ${project.name || project.id}`}
      author="FuelFlo"
      subject="Project fuel report"
      creator="FuelFlo"
      producer="react-pdf"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.eyebrow}>Project fuel report</Text>
          <Text style={styles.title}>{project.name || 'Unnamed project'}</Text>
          <Text style={styles.subtitle}>
            {project.location || 'No location'} • {formatDate(project.start_date)}
            {' - '}
            {formatDate(project.end_date)}
          </Text>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Delivered</Text>
            <Text style={styles.metricValue}>{formatLitres(deliveredLitres)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Returned</Text>
            <Text style={styles.metricValue}>{formatLitres(returnedLitres)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Net used</Text>
            <Text style={styles.metricValue}>{formatLitres(netUsedLitres)}</Text>
          </View>
          {showFinancials && (
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Gross margin</Text>
              <Text style={styles.metricValue}>{formatMoney(grossMargin)}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Project ID</Text>
            <Text style={styles.value}>{project.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {project.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Organizer</Text>
            <Text style={styles.value}>{project.contractor_name || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{project.company_name || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expected litres</Text>
            <Text style={styles.value}>{formatLitres(project.expected_liters)}</Text>
          </View>
        </View>

        {showFinancials && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fuel Financials</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Buy price</Text>
              <Text style={styles.value}>{purchasePrice.toFixed(2)} SAR/L</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sell price</Text>
              <Text style={styles.value}>{sellingPrice.toFixed(2)} SAR/L</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Revenue basis</Text>
              <Text style={styles.value}>{formatMoney(revenue)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Delivered cost</Text>
              <Text style={styles.value}>{formatMoney(deliveredCost)}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuel Transactions</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colType}>Type</Text>
            <Text style={styles.colAsset}>Asset</Text>
            <Text style={styles.colFuel}>Fuel</Text>
            <Text style={styles.colStatus}>Status</Text>
          </View>
          {transactions.length === 0 ? (
            <Text>No fuel transactions found.</Text>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.tableRow}>
                <Text style={styles.colDate}>
                  {formatDate(transaction.created_at)}
                </Text>
                <Text style={styles.colType}>{transaction.type || '-'}</Text>
                <Text style={styles.colAsset}>{assetName(transaction)}</Text>
                <Text style={styles.colFuel}>{movement(transaction)}</Text>
                <Text style={styles.colStatus}>
                  {transaction.status || 'Recorded'}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Generated report - Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
