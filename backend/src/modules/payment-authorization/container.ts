import { HandleSfcPaymentTapUseCase } from "./application/use-cases/handle-sfc-payment-tap.usecase.js";

import { BasicPaymentAuthorizationService } from "./application/services/basic-payment-authorization.service.js";

import { PaymentAuthorizationController } from "./presentation/controllers/payment-authorization.controller.js";

import { buildPaymentAuthorizationRoutes } from "./presentation/routes/payment-authorization.routes.js";

import env from "@/shared/config/env.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { SfcDeviceVerifierService } from "../devices/application/services/sfc-device-verifier.service.js";
import { PrismaDeviceRepository } from "../devices/infrastructure/prisma/prisma-device.repository.js";
import { PrismaProvisionedDeviceRepository } from "../devices/infrastructure/prisma/prisma-provisioned-device.repository.js";
import { SecureSfcProofVerifierService } from "../devices/infrastructure/sfc/secure-sfc-proof-verifier.service.js";
import { DefaultSecureSfcCryptographicVerifier } from "../devices/infrastructure/security/default-secure-sfc-cryptographic-verifier.js";
import { DefaultPaymentAuthorizationPolicy } from "./domain/policies/payment-authorization.policy.js";
import { CompositePaymentRealtimeChannel } from "./infrastructure/realtime/composite-payment-realtime.channel.js";
import { FirebasePaymentRealtimeChannel } from "./infrastructure/realtime/fcm-payment-realtime.channel.js";
import { FirebasePushNotificationProvider } from "../notifications/infrastructure/firebase/firebase-push-notification.provider.js";
import { SocketIoPaymentRealtimeChannel } from "./infrastructure/realtime/socket-io-payment-realtime.channel.js";
import { socketServer } from "@/app/server.js";
import { DefaultPinVerifier } from "./application/ports/pin-verifier.port.js";

// prisma infras
const prismaRepositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, prismaRepositoryFactory);
const sfcDeviceRepository = new PrismaDeviceRepository(prisma);
const provisionedDeviceRepository = new PrismaProvisionedDeviceRepository(
  prisma,
);

// default cryptographic verifier
const cryptographicVerifier = new DefaultSecureSfcCryptographicVerifier(); // TODO:
const secureSfcProofVerifier = new SecureSfcProofVerifierService(
  sfcDeviceRepository,
  cryptographicVerifier,
);

// device verifier service
const sfcDeviceVerifierService = new SfcDeviceVerifierService(
  sfcDeviceRepository,
  provisionedDeviceRepository,
  secureSfcProofVerifier,
);

const paymentAuthorizationPolicy = new DefaultPaymentAuthorizationPolicy(); // TODO:

// real time channels square
const pushNotification = new FirebasePushNotificationProvider();

const fcmRealtimeChannel = new FirebasePaymentRealtimeChannel(
  pushNotification,
  unitOfWork, // TODO: BUG here
);
const socketIoRealtimeChannel = new SocketIoPaymentRealtimeChannel(
  socketServer.io,
);

const paymentRealtimeChannel = new CompositePaymentRealtimeChannel([
  fcmRealtimeChannel,
  socketIoRealtimeChannel,
]);

// tap usecase
const handleSfcPaymentTapUseCase = new HandleSfcPaymentTapUseCase(
  unitOfWork,
  sfcDeviceVerifierService,
  paymentAuthorizationPolicy,
  paymentRealtimeChannel,
);

// basic payment auth service
const pinVerifier = new DefaultPinVerifier(); // TODO:
const basicPaymentAuthorizationService = new BasicPaymentAuthorizationService(
  unitOfWork,
  pinVerifier,
  paymentRealtimeChannel,
);

// main
const paymentAuthorizationController = new PaymentAuthorizationController(
  handleSfcPaymentTapUseCase,
  basicPaymentAuthorizationService,
);

export const paymentAuthorizationRoutes = buildPaymentAuthorizationRoutes(
  paymentAuthorizationController,
  env.JWT_ACCESS_SECRET,
);
