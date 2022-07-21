from re import findall

s = '''
export class fcmPositionSettlement__Params {
  _event: fcmPositionSettlement;

  constructor(event: fcmPositionSettlement) {
    this._event = event;
  }

  get trader(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get settlementCashflow(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}
'''

event_type = findall('_event: (.*);', s)[0]
event_var_name = '{}Event'.format(event_type[:1].lower() + event_type[1:])

print('const {} = changetype<{}>(newMockEvent());'.format(event_var_name, event_type))

print('const eventAddress = INSERT_Address;')
params = findall('get (.*)\(\)', s)
params_type = findall('\(\): (.*) {', s)
params_info = '\n'
for param, param_type in zip(params, params_type):
  print('const {} = INSERT_{};'.format(param, param_type))
  param_type = param_type[:1].upper() + param_type[1:]
  if param_type == 'BigInt':
    param_type = 'UnsignedBigInt'
  params_info += '  new ethereum.EventParam(\'{}\', ethereum.Value.from{}({})),\n'.format(param,param_type,param)
print('')

print('{}.address = eventAddress;'.format(event_var_name))
print('{}.parameters = [{}];'.format(event_var_name, params_info))
