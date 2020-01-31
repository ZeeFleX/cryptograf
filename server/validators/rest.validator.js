const Schema = require("validate");

const AcceptOfferValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    billing_account: {
      type: String,
      required: true
    },
    accepted: {
      type: Boolean,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    }
  }
});

const CalcOrderContractValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    id: {
      type: String,
      required: true
    },
    customer: {
      type: Number,
      required: true
    },
    device_values: {
      type: Array,
      each: {
        type: Object,
        device_id: {
          type: String,
          required: true
        },
        tariff_code: {
          type: Number,
          required: true
        },
        tariff_type: {
          type: Number,
          required: true
        },
        tariff_name: {
          type: String,
          required: true
        },
        last_paid_value: {
          type: Number,
          required: true
        },
        current_value: {
          type: Number,
          required: true
        }
      }
    },
    old_balance_state: {
      type: Array,
      each: {
        type: Object,
        code: {
          type: Number,
          required: true
        },
        order: {
          type: Number,
          required: true
        },
        sum: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }
    }
  }
});

const BankAcquiringPaymentValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    ls: {
      type: String,
      required: true
    },
    customer_id: {
      type: Number,
      required: true
    },
    payment_id: {
      type: Number,
      required: true
    },
    sum: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    trx_id: {
      type: String,
      required: true
    },
    result_code: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    exponent: {
      type: Number,
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    transaction_type: {
      type: String,
      required: true
    }
  }
});

const BillingBalanceUpdateValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    customer_id: {
      type: Number,
      required: true
    },
    balance: {
      type: Array,
      each: {
        type: Object,
        code: {
          type: Number,
          required: true
        },
        sum: {
          type: Number,
          required: true
        }
      }
    }
  }
});

const BillingAccountUpdateValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    account: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    ls_blocked: {
      type: Boolean,
      required: true
    },
    payments: {
      type: Array,
      each: {
        type: Object,
        order: {
          type: Number,
          required: true
        },
        code: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        sum: {
          type: Number,
          required: true
        }
      }
    }
  }
});

const BillingPaymentUpdateValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    date: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    sum: {
      type: Number,
      required: true
    }
  }
});

const BillingMeterDeviceUpdateValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String,
    required: true
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    date: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    consumption: {
      type: Number,
      required: true
    }
  }
});

const TelecopeValueValidator = new Schema({
  id: {
    type: String,
    required: true
  },
  message_type: {
    type: String,
    required: true
  },
  received_at: {
    type: String,
    required: true
  },
  data_provider: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  billing_account: {
    type: String
  },
  counters: {
    type: Array,
    each: { type: String }
  },
  snapshot: {
    type: Number || null
  },
  payload: {
    id: {
      type: String,
      required: true
    },
    device_id: {
      type: String,
      required: true
    },
    ts_UTC: {
      type: Number,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  notTransmit: {
    type: Boolean,
    required: false
  }
});

module.exports = {
  AcceptOfferValidator,
  CalcOrderContractValidator,
  BankAcquiringPaymentValidator,
  BillingBalanceUpdateValidator,
  BillingAccountUpdateValidator,
  BillingPaymentUpdateValidator,
  BillingMeterDeviceUpdateValidator,
  TelecopeValueValidator
};
