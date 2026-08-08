import type { UserRepository } from "@/modules/users/domain/repositories/user.repository.js";
import type { LedgerAccountRepository } from "@/modules/ledger/domain/repositories/ledger-account.repository.js";
import type { WalletRepository } from "@/modules/wallets/domain/repositories/wallets.repository.js";
import type { DeviceRepository } from "@/modules/devices/domain/repositories/device.repository.js";
import type { ProvisionedDeviceRepository } from "@/modules/devices/domain/repositories/provisioned-device.repository.js";
import type { TransferRepository } from "@/modules/transfers/domain/repositories/transfer.repository.js";

export interface Repositories {
  users: UserRepository;
  wallets: WalletRepository;
  ledger: LedgerAccountRepository;
  device: DeviceRepository;
  provisionedDevice: ProvisionedDeviceRepository;
  transfers: TransferRepository;
}
