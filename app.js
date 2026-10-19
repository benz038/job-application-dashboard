(() => {
  'use strict';
  const STORAGE_KEY = 'jobtrack.applications.v1';
  const statuses = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
  const $ = (id) => document.getElementById(id);
  const els = {
    rows: $('applicationRows'), empty: $('emptyState'), total: $('totalStat'), progress: $('progressStat'), offers: $('offersStat'), response: $('responseStat'),
    navCount: $('navCount'), resultsCount: $('resultsCount'), search: $('searchInput'), statusFilter: $('statusFilter'), sort: $('sortSelect'),
    backdrop: $('modalBackdrop'), form: $('applicationForm'), modalTitle: $('modalTitle'), id: $('applicationId'), company: $('companyInput'), role: $('roleInput'), date: $('dateInput'), status: $('statusInput'), url: $('urlInput'), notes: $('notesInput'), error: $('formError'), toast: $('toast')
  };
  let applications = loadApplications();
  let toastTimeout;

  function loadApplications() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.company && item.role) : [];
    } catch (error) { return []; }
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(applications)); return true; }
    catch (error) { showToast('Could not save. Browser storage may be full.'); return false; }
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function formatDate(date) {
    if (!date) return '—';
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? escapeHtml(date) : parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function statusClass(status) { return `status-${String(status).toLowerCase()}`; }
  function getVisibleApplications() {
    const query = els.search.value.trim().toLowerCase();
    const status = els.statusFilter.value;
    const filtered = applications.filter((item) => {
      const matchesQuery = !query || `${item.company} ${item.role} ${item.notes || ''}`.toLowerCase().includes(query);
      return matchesQuery && (status === 'All' || item.status === status);
    });
    return filtered.sort((a, b) => {
      if (els.sort.value === 'oldest') return (a.date || '').localeCompare(b.date || '');
      if (els.sort.value === 'company') return a.company.localeCompare(b.company);
      return (b.date || '').localeCompare(a.date || '');
    });
  }
  function render() {
    const inProgress = applications.filter((a) => ['Applied', 'Assessment', 'Interview'].includes(a.status)).length;
    const offers = applications.filter((a) => a.status === 'Offer').length;
    const responded = applications.filter((a) => ['Assessment', 'Interview', 'Offer', 'Rejected'].includes(a.status)).length;
    els.total.textContent = applications.length;
    els.progress.textContent = inProgress;
    els.offers.textContent = offers;
    els.response.textContent = applications.length ? `${Math.round(responded / applications.length * 100)}%` : '0%';
    els.navCount.textContent = applications.length;
    const visible = getVisibleApplications();
    els.rows.innerHTML = visible.map((item) => {
      const initials = item.company.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
      const safeUrl = safeHttpUrl(item.url);
      return `<tr>
        <td><div class="company-cell"><div class="company-logo">${escapeHtml(initials || '?')}</div><div><div class="company-name">${escapeHtml(item.company)}</div><div class="role-name">${escapeHtml(item.role)}</div></div></div></td>
        <td class="date-cell">${formatDate(item.date)}</td>
        <td><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td>
        <td>${safeUrl ? `<a class="job-link" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">View posting ↗</a>` : '<span>—</span>'}</td>
        <td><div class="row-actions"><button class="icon-btn" data-action="edit" data-id="${escapeHtml(item.id)}" aria-label="Edit ${escapeHtml(item.company)}" title="Edit">✎</button><button class="icon-btn" data-action="delete" data-id="${escapeHtml(item.id)}" aria-label="Delete ${escapeHtml(item.company)}" title="Delete">⌫</button></div></td>
      </tr>`;
    }).join('');
    const hasVisible = visible.length > 0;
    els.empty.style.display = hasVisible ? 'none' : 'block';
    els.rows.parentElement.querySelector('thead').style.display = hasVisible ? '' : 'none';
    els.resultsCount.textContent = `Showing ${visible.length} of ${applications.length} application${applications.length === 1 ? '' : 's'}`;
  }
  function safeHttpUrl(value) {
    if (!value) return '';
    try { const parsed = new URL(value); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; }
    catch (error) { return ''; }
  }
  function showToast(message) {
    els.toast.textContent = message; els.toast.classList.add('show');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }
  function openModal(item = null) {
    els.form.reset(); els.error.textContent = ''; els.id.value = item?.id || '';
    els.modalTitle.textContent = item ? 'Edit application' : 'Add application';
    $('saveBtn').textContent = item ? 'Save changes' : 'Save application';
    els.company.value = item?.company || ''; els.role.value = item?.role || '';
    els.date.value = item?.date || new Date().toISOString().slice(0, 10);
    els.status.value = item?.status || 'Applied'; els.url.value = item?.url || ''; els.notes.value = item?.notes || '';
    els.backdrop.hidden = false; document.body.style.overflow = 'hidden'; els.company.focus();
  }
  function closeModal() { els.backdrop.hidden = true; document.body.style.overflow = ''; }
  function saveApplication(event) {
    event.preventDefault(); els.error.textContent = '';
    const company = els.company.value.trim(); const role = els.role.value.trim(); const url = els.url.value.trim();
    if (!company || !role || !els.date.value) { els.error.textContent = 'Company, role and date applied are required.'; return; }
    if (url && !safeHttpUrl(url)) { els.error.textContent = 'Enter a valid http:// or https:// job URL.'; return; }
    const id = els.id.value || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const previous = applications.find((a) => a.id === id);
    const record = { id, company, role, date: els.date.value, status: statuses.includes(els.status.value) ? els.status.value : 'Applied', url, notes: els.notes.value.trim(), createdAt: previous?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (previous) applications = applications.map((a) => a.id === id ? record : a); else applications.unshift(record);
    if (persist()) { closeModal(); render(); showToast(previous ? 'Application updated.' : 'Application added.'); }
  }
  function deleteApplication(id) {
    const item = applications.find((a) => a.id === id); if (!item) return;
    if (!window.confirm(`Delete the ${item.role} application at ${item.company}?`)) return;
    applications = applications.filter((a) => a.id !== id);
    if (persist()) { render(); showToast('Application deleted.'); }
  }
  function exportCsv() {
    if (!applications.length) { showToast('Add an application before exporting.'); return; }
    const columns = ['company', 'role', 'date', 'status', 'url', 'notes'];
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [columns.join(','), ...applications.map((item) => columns.map((key) => quote(item[key])).join(','))].join('\r\n');
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); showToast('CSV exported.');
  }

  $('addTopBtn').addEventListener('click', () => openModal());
  $('emptyAddBtn').addEventListener('click', () => openModal());
  $('closeModalBtn').addEventListener('click', closeModal);
  $('cancelBtn').addEventListener('click', closeModal);
  els.backdrop.addEventListener('click', (event) => { if (event.target === els.backdrop) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !els.backdrop.hidden) closeModal(); });
  els.form.addEventListener('submit', saveApplication);
  [els.search, els.statusFilter, els.sort].forEach((element) => element.addEventListener(element === els.search ? 'input' : 'change', render));
  $('clearFiltersBtn').addEventListener('click', () => { els.search.value = ''; els.statusFilter.value = 'All'; els.sort.value = 'newest'; render(); });
  $('exportBtn').addEventListener('click', exportCsv);
  els.rows.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]'); if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'edit') { const item = applications.find((a) => a.id === id); if (item) openModal(item); }
    if (action === 'delete') deleteApplication(id);
  });
  render();
})();
