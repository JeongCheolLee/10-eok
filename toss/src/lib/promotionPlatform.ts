import { Promotion, Storage, User } from "@apps-in-toss/web-framework";
import { createCalculationPromotion, promotionConfig, promotionStorageKey, type CalculationPromotion } from "./calculationPromotion";
import { entryPath, entryQuery, inToss } from "./platform";

/** Campaign code and amount are build settings, never accepted from a share URL. */
export function loadEntryPromotion(): CalculationPromotion | null {
  const config = promotionConfig(import.meta.env);
  if (!config || entryPath() !== "promotion") return null;
  const testRun = config.test ? entryQuery().get("testRun") : null;
  return createCalculationPromotion(config, {
    get: (key) => Storage.getItem(promotionStorageKey(config, key, testRun)),
    set: (key, value) => Storage.setItem(promotionStorageKey(config, key, testRun), value),
    identify: async () => {
      if (!inToss || !Promotion.grantReward.isSupported() || !User.getAnonymousKey.isSupported()) throw Error("Unsupported");
      return (await User.getAnonymousKey()).hash;
    },
    grant: (promotionCode, amount) => Promotion.grantReward({ promotionCode, amount }),
    reference: () => crypto.randomUUID(),
  });
}
