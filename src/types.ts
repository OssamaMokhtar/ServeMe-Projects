/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface POSItem {
  id: string;
  name: string;
  price: number;
  paid: boolean;
}

export interface POSTable {
  id: string;
  items: POSItem[];
}
