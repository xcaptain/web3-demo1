import React from 'react';
import { ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import {
    web3Accounts,
    web3Enable,
    web3FromAddress,
    web3ListRpcProviders,
    web3UseRpcProvider
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';


interface Props {}
interface DemoState {
    address: string[],
}
export class DemoForm extends React.Component<Props, DemoState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            address: [],
        }
    }
    async componentDidMount() {
        let accounts = await getAccounts();
        this.setState({address: accounts});
    }

    render() {
        return (
            <ProForm
                onFinish={async (values) => {
                    await burnForEZC(values.deeper_address, values.evm_address);
                    console.log(values);
                }}
            >
                <ProFormSelect
                    width="xs"
                    options={this.state.address.map(v => {
                        return {value: v, label: v};
                    })}
                    name="deeper_address"
                    label="deeper chain address"
                />

                <ProFormText name="evm_address" label="evm address" />
            </ProForm>
        );
    }
}

async function getAccounts(): Promise<string[]> {
    const allInjected = await web3Enable('my cool dapp');
    const allAccounts = await web3Accounts();
    let res = [];
    for (let account of allAccounts) {
        res.push(account.address);
    }
    console.log('all', allAccounts);
    return res;
}

// 0x720aC46FdB6da28FA751bc60AfB8094290c2B4b7
async function burnForEZC(deeper_address: string, evm_address: string) {
    const wsProvider = new WsProvider('wss://voyager-ubuntu:9945');
    const api = await ApiPromise.create({ provider: wsProvider });

    const injector = await web3FromAddress(deeper_address);
    console.log('inject', injector, deeper_address);
    const tx = await api.tx.operation.burnForEzc('60000000000000000000', evm_address).signAndSend(deeper_address, {signer: injector.signer});

    console.log('tx', tx);
}