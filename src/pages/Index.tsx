
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/lib/api';
import { Server, Lock, Shield, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState('http://181.189.124.150:8082');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Validação de erro',
        description: 'Por favor, informe email e senha',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Update the localStorage with server URL
      localStorage.setItem('traccar_server_url', serverUrl);
      
      await login(email, password);
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao Painel de Administração Traccar',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Falha no login:', error);
      toast({
        title: 'Falha no login',
        description: 'Credenciais inválidas ou erro no servidor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-secondary p-4">
      <div className="max-w-md w-full space-y-8 animate-scale-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Server className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Traccar Admin</h1>
          <p className="text-muted-foreground mt-2">Entre para gerenciar seu servidor de rastreamento GPS</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="server">Configuração do Servidor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-xl">Acessar</CardTitle>
                <CardDescription>
                  Insira suas credenciais para acessar o painel de administração
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Esqueceu a senha?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="server">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-xl">Configuração do Servidor</CardTitle>
                <CardDescription>
                  Configure a URL do servidor Traccar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="server-url">URL do Servidor</Label>
                  <div className="relative">
                    <Input
                      id="server-url"
                      type="text"
                      placeholder="http://servidor:porta"
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      className="pl-10"
                    />
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A URL deve incluir o protocolo (http:// ou https://) e a porta, se aplicável
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    localStorage.setItem('traccar_server_url', serverUrl);
                    toast({
                      title: 'Configuração salva',
                      description: 'A URL do servidor foi atualizada',
                    });
                  }}
                >
                  Salvar Configuração
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            URL padrão do servidor: <span className="font-medium">http://181.189.124.150:8082</span>
          </p>
          <p className="mt-1">
            Para fins de demonstração, use <span className="font-medium">admin</span> / <span className="font-medium">admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
