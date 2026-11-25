export function AddressText({
  recipient,
  phone,
  postalCode,
  address,
  detail,
}: {
  recipient: string;
  phone?: string;
  postalCode?: string;
  address: string;
  detail?: string | null;
}) {
  return (
    <address data-slot="address" className="ez:grid ez:gap-0.5 ez:not-italic ez:text-fg">
      {recipient && (
        <span>
          {recipient}
          {phone && <span className="ez:ml-2 ez:text-muted">{phone}</span>}
        </span>
      )}
      <span className="ez:text-site-small">
        {postalCode && <span className="ez:text-muted">({postalCode}) </span>}
        {address} {detail ?? ""}
      </span>
    </address>
  );
}
