create table "Users" (
    "Id"         serial unique,
    "Username"   varchar(32) UNIQUE,
    "BnbAddress" varchar(128) null,
    "Identifier" varchar(64) UNIQUE,
    "Timestamp"  TIMESTAMP with time zone NOT NULL DEFAULT (now() at time zone 'utc')
)

create table "Transactions"
(
    "Id"             serial unique,
    "TxHash"         text,
    "FromAddress"    text,
    "ToAddress"      text,
    "FromNick"       text,
    "ToNick"         text,
    "Currency"       text,
    "SumInCurrency"  numeric,
    "SumInDollars"   numeric,
    "FromIdentifier" text,
    "ToIdentifier"   text,
    "Timestamp"      TIMESTAMP with time zone NOT NULL DEFAULT (now() at time zone 'utc')
);
