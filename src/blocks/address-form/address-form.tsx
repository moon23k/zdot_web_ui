"use client";

import { useId, useState } from "react";
import { Button } from "../../components/button";
import { Field, Input } from "../../components/field";
import { cn } from "../../utils/cn";
import { fieldset, legend } from "../parts/choice";
import { loadScript } from "../../utils/script";

type Picked = { zonecode: string; roadAddress: string };

type PostcodeWindow = Window & {
  daum?: { Postcode: new (opts: { oncomplete: (data: Picked) => void }) => { open: () => void } };
};

const SCRIPT = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const MOCK: Picked = { zonecode: "06236", roadAddress: "서울 강남구 테헤란로 152" };

function loadPostcode(): Promise<void> {
  return loadScript(SCRIPT, () => Boolean((window as PostcodeWindow).daum?.Postcode));
}

export type AddressValue = {
  recipient?: string;
  phone?: string;
  postal_code?: string;
  address?: string;
  address_detail?: string | null;
};

export function AddressForm({
  initial,
  mock,
  onPostalChange,
  bare,
}: {
  initial?: AddressValue;
  mock?: boolean;
  onPostalChange?: (postal: string) => void;
  bare?: boolean;
}) {
  const [postal, setPostal] = useState(initial?.postal_code ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [failed, setFailed] = useState(false);
  const addressId = useId();
  const apply = (data: Picked) => {
    setPostal(data.zonecode);
    setAddress(data.roadAddress);
    onPostalChange?.(data.zonecode);
  };
  const search = async () => {
    if (mock) return apply(MOCK);
    try {
      await loadPostcode();
      const daum = (window as PostcodeWindow).daum;
      if (daum) new daum.Postcode({ oncomplete: apply }).open();
    } catch {
      setFailed(true);
    }
  };
  return (
    <fieldset data-slot="address-form" className={cn(fieldset, "ez:gap-6 ez:md:grid-cols-2", bare && "ez:md:col-span-2")}>
      <legend className={cn(legend, "ez:mb-4 ez:text-site-heading ez:text-fg", bare && "ez:sr-only")}>배송지</legend>
      <Field label="받는 분">
        <Input name="recipient" defaultValue={initial?.recipient} required maxLength={100} autoComplete="name" />
      </Field>
      <Field label="휴대폰 번호">
        <Input name="phone" defaultValue={initial?.phone} required inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" />
      </Field>
      <input type="hidden" name="postal_code" value={postal} />
      <input type="hidden" name="address" value={address} />
      <div className="ez:grid ez:gap-2 ez:md:col-span-2">
        <label htmlFor={addressId} className="ez:text-site-small ez:text-muted">
          주소
        </label>
        <div className="ez:grid ez:grid-cols-[minmax(0,1fr)_auto] ez:items-center ez:gap-3 ez:border-0 ez:border-b ez:border-solid ez:border-site-field">
          <Input
            id={addressId}
            value={postal ? `(${postal}) ${address}` : ""}
            readOnly
            required
            placeholder="주소 검색"
            onClick={search}
            className="ez:cursor-pointer ez:border-b-0"
          />
          <Button variant="outline" size="sm" onClick={search}>
            주소 검색
          </Button>
        </div>
        {failed && (
          <span className="ez:text-site-caption ez:text-danger" role="alert">
            주소 검색을 불러오지 못했어요. 잠시 후 다시 눌러 주세요.
          </span>
        )}
      </div>
      <Field label="상세 주소" wide>
        <Input name="address_detail" defaultValue={initial?.address_detail ?? ""} maxLength={300} placeholder="동·호수 등" />
      </Field>
    </fieldset>
  );
}
