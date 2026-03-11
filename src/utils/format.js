export const formatDate = (d) => {
  if(!d) return '';
  const dt = new Date(d);
  return dt.toLocaleString();
}
export const formatCurrency = (v) => (Number(v)||0).toFixed(2);

