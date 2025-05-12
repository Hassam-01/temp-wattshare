
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';

const Messages = () => {
  const { dealId } = useParams<{ dealId?: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Fetch user's deals
  const { data: deals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['user-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          status,
          created_at,
          listings (
            id,
            title,
            price
          ),
          seller:profiles!deals_seller_id_fkey (
            id,
            first_name,
            last_name
          ),
          customer:profiles!deals_customer_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .or(`seller_id.eq.${authState.user?.id},customer_id.eq.${authState.user?.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!authState.user?.id,
  });
  
  // If a deal ID is provided, fetch messages for that deal
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['deal-messages', dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender:profiles!messages_sender_id_fkey (
            id,
            first_name,
            last_name
          ),
          receiver:profiles!messages_receiver_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('deal_id', dealId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Mark messages as read
      if (data.length > 0) {
        const unreadMessages = data.filter(
          msg => msg.receiver.id === authState.user?.id && !msg.is_read
        );
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map(msg => msg.id);
          
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
        }
      }
      
      return data;
    },
    enabled: !!dealId && !!authState.user?.id,
  });
  
  // Fetch the current deal details
  const { data: currentDeal } = useQuery({
    queryKey: ['current-deal', dealId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          status,
          listings (
            id,
            title,
            price
          ),
          seller:profiles!deals_seller_id_fkey (
            id,
            first_name,
            last_name
          ),
          customer:profiles!deals_customer_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', dealId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!dealId && !!authState.user?.id,
  });
  
  // Set up real-time subscription for messages
  useEffect(() => {
    if (!dealId || !authState.user?.id) return;
    
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `deal_id=eq.${dealId}`,
      }, () => {
        refetchMessages();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [dealId, authState.user?.id, refetchMessages]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);
  
  const handleSendMessage = async () => {
    if (!authState.user) {
      toast.error('You must be logged in to send messages');
      return;
    }
    
    if (!dealId) {
      toast.error('No deal selected');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    try {
      const receiverId = authState.user.id === currentDeal.seller.id 
        ? currentDeal.customer.id 
        : currentDeal.seller.id;
      
      const { error } = await supabase
        .from('messages')
        .insert({
          deal_id: dealId,
          sender_id: authState.user.id,
          receiver_id: receiverId,
          content: message.trim()
        });
      
      if (error) throw error;
      
      setMessage('');
      await refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (authState.isLoading || (dealId && isLoadingMessages) || isLoadingDeals) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Deals sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Deals</CardTitle>
              </CardHeader>
              <CardContent>
                {deals && deals.length > 0 ? (
                  <div className="space-y-3">
                    {deals.map(deal => (
                      <div 
                        key={deal.id} 
                        className={`p-3 rounded-md cursor-pointer ${
                          dealId === deal.id 
                            ? 'bg-primary/10 border-l-4 border-primary' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => navigate(`/messages/${deal.id}`)}
                      >
                        <div className="font-medium line-clamp-1">{deal.listings.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {authState.user?.id === deal.seller.id 
                            ? `With: ${deal.customer.first_name} ${deal.customer.last_name}`
                            : `With: ${deal.seller.first_name} ${deal.seller.last_name}`
                          }
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          ${deal.listings.price} • {deal.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No deals found</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => navigate('/explore')}
                    >
                      Explore Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Message area */}
          <div className="md:col-span-3">
            {dealId && currentDeal ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{currentDeal.listings.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {authState.user?.id === currentDeal.seller.id 
                          ? `Customer: ${currentDeal.customer.first_name} ${currentDeal.customer.last_name}`
                          : `Seller: ${currentDeal.seller.first_name} ${currentDeal.seller.last_name}`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${currentDeal.listings.price}</div>
                      <div className="text-xs uppercase px-2 py-1 rounded-full bg-primary/10 text-primary inline-block">
                        {currentDeal.status}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow overflow-y-auto p-0">
                  <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {messagesData && messagesData.length > 0 ? (
                      messagesData.map(msg => {
                        const isCurrentUser = msg.sender.id === authState.user?.id;
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-lg ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="text-sm">{msg.content}</div>
                              <div className={`text-xs mt-1 ${
                                isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isSending || !message.trim()}
                      className="self-end"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                  <h3 className="text-xl font-semibold mb-2">Select a deal to view messages</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose a deal from the sidebar or explore products to start a new conversation
                  </p>
                  <Button onClick={() => navigate('/explore')}>
                    Explore Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
