export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({ 'nodesInSubnet' : IDL.Nat32 });
  const Auth = IDL.Variant({
    'RegisterProvider' : IDL.Null,
    'FreeRpc' : IDL.Null,
    'PriorityRpc' : IDL.Null,
    'Manage' : IDL.Null,
  });
  const EthSepoliaService = IDL.Variant({
    'Alchemy' : IDL.Null,
    'BlockPi' : IDL.Null,
    'PublicNode' : IDL.Null,
    'Ankr' : IDL.Null,
  });
  const L2MainnetService = IDL.Variant({
    'Alchemy' : IDL.Null,
    'BlockPi' : IDL.Null,
    'PublicNode' : IDL.Null,
    'Ankr' : IDL.Null,
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const RpcApi = IDL.Record({
    'url' : IDL.Text,
    'headers' : IDL.Opt(IDL.Vec(HttpHeader)),
  });
  const EthMainnetService = IDL.Variant({
    'Alchemy' : IDL.Null,
    'BlockPi' : IDL.Null,
    'Cloudflare' : IDL.Null,
    'PublicNode' : IDL.Null,
    'Ankr' : IDL.Null,
  });
  const RpcServices = IDL.Variant({
    'EthSepolia' : IDL.Opt(IDL.Vec(EthSepoliaService)),
    'BaseMainnet' : IDL.Opt(IDL.Vec(L2MainnetService)),
    'Custom' : IDL.Record({
      'chainId' : IDL.Nat64,
      'services' : IDL.Vec(RpcApi),
    }),
    'OptimismMainnet' : IDL.Opt(IDL.Vec(L2MainnetService)),
    'ArbitrumOne' : IDL.Opt(IDL.Vec(L2MainnetService)),
    'EthMainnet' : IDL.Opt(IDL.Vec(EthMainnetService)),
  });
  const RpcConfig = IDL.Record({ 'responseSizeEstimate' : IDL.Opt(IDL.Nat64) });
  const BlockTag = IDL.Variant({
    'Earliest' : IDL.Null,
    'Safe' : IDL.Null,
    'Finalized' : IDL.Null,
    'Latest' : IDL.Null,
    'Number' : IDL.Nat,
    'Pending' : IDL.Null,
  });
  const FeeHistoryArgs = IDL.Record({
    'blockCount' : IDL.Nat,
    'newestBlock' : BlockTag,
    'rewardPercentiles' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const FeeHistory = IDL.Record({
    'reward' : IDL.Vec(IDL.Vec(IDL.Nat)),
    'gasUsedRatio' : IDL.Vec(IDL.Float64),
    'oldestBlock' : IDL.Nat,
    'baseFeePerGas' : IDL.Vec(IDL.Nat),
  });
  const JsonRpcError = IDL.Record({ 'code' : IDL.Int64, 'message' : IDL.Text });
  const ProviderError = IDL.Variant({
    'TooFewCycles' : IDL.Record({ 'expected' : IDL.Nat, 'received' : IDL.Nat }),
    'MissingRequiredProvider' : IDL.Null,
    'ProviderNotFound' : IDL.Null,
    'NoPermission' : IDL.Null,
  });
  const ValidationError = IDL.Variant({
    'CredentialPathNotAllowed' : IDL.Null,
    'HostNotAllowed' : IDL.Text,
    'CredentialHeaderNotAllowed' : IDL.Null,
    'UrlParseError' : IDL.Text,
    'Custom' : IDL.Text,
    'InvalidHex' : IDL.Text,
  });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const HttpOutcallError = IDL.Variant({
    'IcError' : IDL.Record({ 'code' : RejectionCode, 'message' : IDL.Text }),
    'InvalidHttpJsonRpcResponse' : IDL.Record({
      'status' : IDL.Nat16,
      'body' : IDL.Text,
      'parsingError' : IDL.Opt(IDL.Text),
    }),
  });
  const RpcError = IDL.Variant({
    'JsonRpcError' : JsonRpcError,
    'ProviderError' : ProviderError,
    'ValidationError' : ValidationError,
    'HttpOutcallError' : HttpOutcallError,
  });
  const FeeHistoryResult = IDL.Variant({
    'Ok' : IDL.Opt(FeeHistory),
    'Err' : RpcError,
  });
  const RpcService = IDL.Variant({
    'EthSepolia' : EthSepoliaService,
    'BaseMainnet' : L2MainnetService,
    'Custom' : RpcApi,
    'OptimismMainnet' : L2MainnetService,
    'ArbitrumOne' : L2MainnetService,
    'EthMainnet' : EthMainnetService,
    'Chain' : IDL.Nat64,
    'Provider' : IDL.Nat64,
  });
  const MultiFeeHistoryResult = IDL.Variant({
    'Consistent' : FeeHistoryResult,
    'Inconsistent' : IDL.Vec(IDL.Tuple(RpcService, FeeHistoryResult)),
  });
  const Block = IDL.Record({
    'miner' : IDL.Text,
    'totalDifficulty' : IDL.Nat,
    'receiptsRoot' : IDL.Text,
    'stateRoot' : IDL.Text,
    'hash' : IDL.Text,
    'difficulty' : IDL.Nat,
    'size' : IDL.Nat,
    'uncles' : IDL.Vec(IDL.Text),
    'baseFeePerGas' : IDL.Nat,
    'extraData' : IDL.Text,
    'transactionsRoot' : IDL.Opt(IDL.Text),
    'sha3Uncles' : IDL.Text,
    'nonce' : IDL.Nat,
    'number' : IDL.Nat,
    'timestamp' : IDL.Nat,
    'transactions' : IDL.Vec(IDL.Text),
    'gasLimit' : IDL.Nat,
    'logsBloom' : IDL.Text,
    'parentHash' : IDL.Text,
    'gasUsed' : IDL.Nat,
    'mixHash' : IDL.Text,
  });
  const GetBlockByNumberResult = IDL.Variant({
    'Ok' : Block,
    'Err' : RpcError,
  });
  const MultiGetBlockByNumberResult = IDL.Variant({
    'Consistent' : GetBlockByNumberResult,
    'Inconsistent' : IDL.Vec(IDL.Tuple(RpcService, GetBlockByNumberResult)),
  });
  const Topic = IDL.Vec(IDL.Text);
  const GetLogsArgs = IDL.Record({
    'fromBlock' : IDL.Opt(BlockTag),
    'toBlock' : IDL.Opt(BlockTag),
    'addresses' : IDL.Vec(IDL.Text),
    'topics' : IDL.Opt(IDL.Vec(Topic)),
  });
  const LogEntry = IDL.Record({
    'transactionHash' : IDL.Opt(IDL.Text),
    'blockNumber' : IDL.Opt(IDL.Nat),
    'data' : IDL.Text,
    'blockHash' : IDL.Opt(IDL.Text),
    'transactionIndex' : IDL.Opt(IDL.Nat),
    'topics' : IDL.Vec(IDL.Text),
    'address' : IDL.Text,
    'logIndex' : IDL.Opt(IDL.Nat),
    'removed' : IDL.Bool,
  });
  const GetLogsResult = IDL.Variant({
    'Ok' : IDL.Vec(LogEntry),
    'Err' : RpcError,
  });
  const MultiGetLogsResult = IDL.Variant({
    'Consistent' : GetLogsResult,
    'Inconsistent' : IDL.Vec(IDL.Tuple(RpcService, GetLogsResult)),
  });
  const GetTransactionCountArgs = IDL.Record({
    'address' : IDL.Text,
    'block' : BlockTag,
  });
  const GetTransactionCountResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : RpcError,
  });
  const MultiGetTransactionCountResult = IDL.Variant({
    'Consistent' : GetTransactionCountResult,
    'Inconsistent' : IDL.Vec(IDL.Tuple(RpcService, GetTransactionCountResult)),
  });
  const TransactionReceipt = IDL.Record({
    'to' : IDL.Text,
    'status' : IDL.Nat,
    'transactionHash' : IDL.Text,
    'blockNumber' : IDL.Nat,
    'from' : IDL.Text,
    'logs' : IDL.Vec(LogEntry),
    'blockHash' : IDL.Text,
    'type' : IDL.Text,
    'transactionIndex' : IDL.Nat,
    'effectiveGasPrice' : IDL.Nat,
    'logsBloom' : IDL.Text,
    'contractAddress' : IDL.Opt(IDL.Text),
    'gasUsed' : IDL.Nat,
  });
  const GetTransactionReceiptResult = IDL.Variant({
    'Ok' : IDL.Opt(TransactionReceipt),
    'Err' : RpcError,
  });
  const MultiGetTransactionReceiptResult = IDL.Variant({
    'Consistent' : GetTransactionReceiptResult,
    'Inconsistent' : IDL.Vec(
      IDL.Tuple(RpcService, GetTransactionReceiptResult)
    ),
  });
  const SendRawTransactionStatus = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Text),
    'NonceTooLow' : IDL.Null,
    'NonceTooHigh' : IDL.Null,
    'InsufficientFunds' : IDL.Null,
  });
  const SendRawTransactionResult = IDL.Variant({
    'Ok' : SendRawTransactionStatus,
    'Err' : RpcError,
  });
  const MultiSendRawTransactionResult = IDL.Variant({
    'Consistent' : SendRawTransactionResult,
    'Inconsistent' : IDL.Vec(IDL.Tuple(RpcService, SendRawTransactionResult)),
  });
  const ProviderId = IDL.Nat64;
  const Metrics = IDL.Record({
    'cyclesWithdrawn' : IDL.Nat,
    'responses' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text, IDL.Text), IDL.Nat64)
    ),
    'errNoPermission' : IDL.Nat64,
    'inconsistentResponses' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), IDL.Nat64)
    ),
    'cyclesCharged' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), IDL.Nat)
    ),
    'requests' : IDL.Vec(IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), IDL.Nat64)),
    'errHttpOutcall' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), IDL.Nat64)
    ),
    'errHostNotAllowed' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
  });
  const ProviderView = IDL.Record({
    'cyclesPerCall' : IDL.Nat64,
    'owner' : IDL.Principal,
    'hostname' : IDL.Text,
    'primary' : IDL.Bool,
    'chainId' : IDL.Nat64,
    'cyclesPerMessageByte' : IDL.Nat64,
    'providerId' : IDL.Nat64,
  });
  const ManageProviderArgs = IDL.Record({
    'service' : IDL.Opt(RpcService),
    'primary' : IDL.Opt(IDL.Bool),
    'providerId' : IDL.Nat64,
  });
  const RegisterProviderArgs = IDL.Record({
    'cyclesPerCall' : IDL.Nat64,
    'credentialPath' : IDL.Text,
    'hostname' : IDL.Text,
    'credentialHeaders' : IDL.Opt(IDL.Vec(HttpHeader)),
    'chainId' : IDL.Nat64,
    'cyclesPerMessageByte' : IDL.Nat64,
  });
  const RequestResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : RpcError });
  const RequestCostResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : RpcError });
  const UpdateProviderArgs = IDL.Record({
    'cyclesPerCall' : IDL.Opt(IDL.Nat64),
    'credentialPath' : IDL.Opt(IDL.Text),
    'hostname' : IDL.Opt(IDL.Text),
    'credentialHeaders' : IDL.Opt(IDL.Vec(HttpHeader)),
    'primary' : IDL.Opt(IDL.Bool),
    'cyclesPerMessageByte' : IDL.Opt(IDL.Nat64),
    'providerId' : IDL.Nat64,
  });
  return IDL.Service({
    'authorize' : IDL.Func([IDL.Principal, Auth], [IDL.Bool], []),
    'deauthorize' : IDL.Func([IDL.Principal, Auth], [IDL.Bool], []),
    'eth_feeHistory' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), FeeHistoryArgs],
        [MultiFeeHistoryResult],
        [],
      ),
    'eth_getBlockByNumber' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), BlockTag],
        [MultiGetBlockByNumberResult],
        [],
      ),
    'eth_getLogs' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), GetLogsArgs],
        [MultiGetLogsResult],
        [],
      ),
    'eth_getTransactionCount' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), GetTransactionCountArgs],
        [MultiGetTransactionCountResult],
        [],
      ),
    'eth_getTransactionReceipt' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), IDL.Text],
        [MultiGetTransactionReceiptResult],
        [],
      ),
    'eth_sendRawTransaction' : IDL.Func(
        [RpcServices, IDL.Opt(RpcConfig), IDL.Text],
        [MultiSendRawTransactionResult],
        [],
      ),
    'getAccumulatedCycleCount' : IDL.Func([ProviderId], [IDL.Nat], ['query']),
    'getAuthorized' : IDL.Func([Auth], [IDL.Vec(IDL.Principal)], ['query']),
    'getMetrics' : IDL.Func([], [Metrics], ['query']),
    'getNodesInSubnet' : IDL.Func([], [IDL.Nat32], ['query']),
    'getOpenRpcAccess' : IDL.Func([], [IDL.Bool], ['query']),
    'getProviders' : IDL.Func([], [IDL.Vec(ProviderView)], ['query']),
    'getServiceProviderMap' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(RpcService, IDL.Nat64))],
        ['query'],
      ),
    'manageProvider' : IDL.Func([ManageProviderArgs], [], []),
    'registerProvider' : IDL.Func([RegisterProviderArgs], [IDL.Nat64], []),
    'request' : IDL.Func(
        [RpcService, IDL.Text, IDL.Nat64],
        [RequestResult],
        [],
      ),
    'requestCost' : IDL.Func(
        [RpcService, IDL.Text, IDL.Nat64],
        [RequestCostResult],
        ['query'],
      ),
    'setOpenRpcAccess' : IDL.Func([IDL.Bool], [], []),
    'unregisterProvider' : IDL.Func([ProviderId], [IDL.Bool], []),
    'updateProvider' : IDL.Func([UpdateProviderArgs], [], []),
    'withdrawAccumulatedCycles' : IDL.Func([ProviderId, IDL.Principal], [], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({ 'nodesInSubnet' : IDL.Nat32 });
  return [InitArgs];
};
