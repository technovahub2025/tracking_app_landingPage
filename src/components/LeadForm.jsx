
export default function LeadForm({
  data,
  setData,
  onSubmit,
  onClose,
  loading,
  errors,
}) {
  return (
    <div className="tvh-lead">
      <h4>Schedule a Demo</h4>

      <input
        placeholder="Name *"
        value={data.name}
        onChange={e => setData(d => ({ ...d, name: e.target.value }))}
        aria-label="Name"
      />
      {errors?.name && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors.name}
        </span>
      )}

      <input
        type="tel"
        placeholder="Phone Number *"
        value={data.phone}
        onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
        aria-label="Phone Number"
      />
      {errors?.phone && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors.phone}
        </span>
      )}

      <input
        type="email"
        placeholder="Email Address *"
        value={data.email}
        onChange={e => setData(d => ({ ...d, email: e.target.value }))}
        aria-label="Email Address"
      />
      {errors?.email && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors.email}
        </span>
      )}

      <label style={{ marginTop: 10 }}>Demo Date</label>
      <input
        type="date"
        value={data.demoDate}
        onChange={e => setData(d => ({ ...d, demoDate: e.target.value }))}
        aria-label="Demo Date"
      />
      {errors?.demoDate && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors.demoDate}
        </span>
      )}

      <label style={{ marginTop: 10 }}>Demo Time</label>
      <input
        type="time"
        value={data.demoTime}
        onChange={e => setData(d => ({ ...d, demoTime: e.target.value }))}
        aria-label="Demo Time"
      />
      {errors?.demoTime && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors.demoTime}
        </span>
      )}

      {errors?._network && (
        <span style={{ color: 'var(--red)', fontSize: 11 }}>
          {errors._network}
        </span>
      )}

      <div className="tvh-lead-btns">
        <button
          className="tvh-lead-go"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Demo'}
        </button>

        <button
          className="tvh-lead-skip"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}


