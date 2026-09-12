import type { UserRepository } from "@/modules/users/domain/repositories/user.repository.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";
import type { DeviceRepository } from "@/modules/devices/domain/repositories/device.repository.js";
import type { ProvisionedDeviceRepository } from "@/modules/devices/domain/repositories/provisioned-device.repository.js";
import type { TransactionRepository } from "@/modules/transaction/domain/repositories/transaction.repository.js";
import type { LedgerEntryRepository } from "@/modules/ledger/application/repository/ledger-entry.repository.js";
import type { PaymentRequestRepository } from "@/modules/payment-requests/domain/repositories/payment-request.repository.js";
import type { MerchantRepository } from "@/modules/merchants/domain/repositories/merchant.repository.js";
import type { PaymentAuthorizationRepository } from "@/modules/payment-authorization/domain/repositories/payment-authorization.repository.js";
import type { PushDeviceRepository } from "@/modules/notifications/domain/repositories/push-notification.repository.js";

export interface Repositories {
  users: UserRepository;
  wallets: WalletRepository;

  ledger: LedgerAccountRepository;
  ledgerEntries: LedgerEntryRepository;

  transaction: TransactionRepository;

  paymentRequest: PaymentRequestRepository;
  merchant: MerchantRepository;
  paymentAuthorization: PaymentAuthorizationRepository; // TODO: create repo and import

  pushDevice: PushDeviceRepository;

  device: DeviceRepository;
  provisionedDevice: ProvisionedDeviceRepository;
}
