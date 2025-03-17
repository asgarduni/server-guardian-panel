
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Database, Key, ServerCog, Save } from 'lucide-react';

const DATABASE_CONFIG_KEY = 'traccar_database_config';

const DatabasePage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Recuperar configuração salva, se existir
  const savedConfig = localStorage.getItem(DATABASE_CONFIG_KEY);
  const defaultConfig = savedConfig ? JSON.parse(savedConfig) : {
    host: 'localhost',
    port: '3306',
    name: 'traccar',
    user: 'traccar',
    password: '',
  };
  
  const [config, setConfig] = useState(defaultConfig);
  const [testLoading, setTestLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTestConnection = async () => {
    setTestLoading(true);
    
    // Simulação de teste de conexão
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Teste de Conexão',
      description: 'Conexão realizada com sucesso ao banco de dados',
    });
    
    setTestLoading(false);
  };
  
  const handleSaveConfig = () => {
    setSaveLoading(true);
    
    // Simular um atraso para salvar
    setTimeout(() => {
      localStorage.setItem(DATABASE_CONFIG_KEY, JSON.stringify(config));
      
      toast({
        title: 'Configuração Salva',
        description: 'As configurações do banco de dados foram salvas com sucesso.',
      });
      
      setSaveLoading(false);
    }, 800);
  };
  
  return (
    <>
      <Navbar />
      <div className={cn(
        "p-6 md:p-8 space-y-8",
        !isMobile && "ml-64" // Add margin when sidebar is visible
      )}>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Configuração do Banco de Dados</h1>
          <p className="text-muted-foreground">Configure a conexão com o banco de dados do Traccar</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuração MySQL/MariaDB
              </CardTitle>
              <CardDescription>
                Configure os parâmetros para conexão com o banco de dados do Traccar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input 
                    id="host" 
                    name="host" 
                    value={config.host} 
                    onChange={handleChange} 
                    placeholder="localhost" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Porta</Label>
                  <Input 
                    id="port" 
                    name="port" 
                    value={config.port} 
                    onChange={handleChange} 
                    placeholder="3306" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Banco</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={config.name} 
                  onChange={handleChange} 
                  placeholder="traccar" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user">Usuário</Label>
                <Input 
                  id="user" 
                  name="user" 
                  value={config.user} 
                  onChange={handleChange} 
                  placeholder="traccar" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={config.password} 
                    onChange={handleChange} 
                    className="pl-10"
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={testLoading}
                className="w-full sm:w-auto"
              >
                {testLoading ? 'Testando...' : 'Testar Conexão'}
              </Button>
              <Button 
                onClick={handleSaveConfig} 
                disabled={saveLoading}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveLoading ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ServerCog className="h-5 w-5" />
                Informações do Servidor
              </CardTitle>
              <CardDescription>
                Resumo da configuração atual do servidor Traccar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-4 border">
                <h3 className="font-medium mb-2">Status da Conexão com Banco de Dados</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo de Banco</span>
                    <span className="text-sm font-medium">MySQL/MariaDB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">URL do Servidor</span>
                    <span className="text-sm font-medium">
                      {localStorage.getItem('traccar_server_url') || 'http://181.189.124.150:8082'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm font-medium text-green-600">Conectado</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg border-dashed border">
                <h3 className="font-medium mb-2">Dicas de Configuração</h3>
                <ul className="space-y-2 text-sm list-disc ml-5">
                  <li>Certifique-se de que o banco de dados MySQL/MariaDB esteja acessível ao servidor Traccar</li>
                  <li>O usuário deve ter permissões para criar, atualizar e excluir tabelas</li>
                  <li>Recomenda-se usar uma senha forte para o banco de dados</li>
                  <li>Confirme se o firewall permite conexões na porta configurada</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DatabasePage;
