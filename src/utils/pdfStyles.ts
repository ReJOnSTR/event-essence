export const pdfStyles = {
  header: {
    fontSize: 24,
    bold: true,
    color: '#1a73e8',
    margin: [0, 0, 0, 20]
  },
  subheader: {
    fontSize: 14,
    bold: true,
    margin: [0, 5, 0, 0]
  },
  totalInfo: {
    fontSize: 14,
    bold: true,
    color: '#1a73e8',
    margin: [0, 5, 0, 0]
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    fillColor: '#1a73e8',
    color: '#ffffff',
    alignment: 'center'
  },
  tableCell: {
    fontSize: 11,
    alignment: 'center',
    margin: [0, 5]
  }
};

export const tableLayout = {
  hLineWidth: function(i: number, node: any) {
    return i === 0 || i === node.table.body.length ? 2 : 1;
  },
  vLineWidth: function(i: number, node: any) {
    return i === 0 || i === node.table.widths.length ? 2 : 1;
  },
  hLineColor: function(i: number, node: any) {
    return i === 0 || i === node.table.body.length ? '#1a73e8' : '#dadce0';
  },
  vLineColor: function(i: number, node: any) {
    return i === 0 || i === node.table.widths.length ? '#1a73e8' : '#dadce0';
  },
  paddingLeft: function(i: number) { return 8; },
  paddingRight: function(i: number) { return 8; },
  paddingTop: function(i: number) { return 8; },
  paddingBottom: function(i: number) { return 8; }
};