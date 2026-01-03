<?php

namespace App\Notifications;

use App\Services\GeezSMSService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PreOrderPaidGeezSMSNotification extends Notification
{
    use Queueable;

    protected $preOrder;
    protected $smsService;

    public function __construct($preOrder)
    {
        $this->preOrder = $preOrder;
        $this->smsService = app(GeezSMSService::class);
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        // Since this is for customer SMS, we'll call this manually from the controller
        return [];
    }

    /**
     * Send SMS directly to customer using GeezSMS
     */
    public function sendCustomerSMS(): bool
    {
        if (!$this->smsService->isConfigured()) {
            return false;
        }

        $message = $this->generateSMSMessage();
        
        return $this->smsService->sendMessage(
            $this->preOrder->phone_number,
            $message
        );
    }

    /**
     * Generate the SMS message (optimized for GeezSMS - max 335 characters)
     */
    private function generateSMSMessage(): string
    {
        // Format products list
        $products = $this->preOrder->items->map(function($item) {
             return ($item->product->product_name ?? 'Unknown') . " (" . $item->quantity . ")";
        })->implode(', ');

        // Determine Discount/Order Type
        $orderTypeName = $this->preOrder->orderType?->name ?? 'Unknown';
        $isWalkin = str_contains(strtolower($orderTypeName), 'walkin');
        $discountType = $isWalkin ? 'ቅርንጫፍ ደንበኛ' : 'ሸገር ገበታ';
        $orderMethod = $isWalkin ? 'ከቅርንጫፍ ያዘዙት' : 'ደውለው ያዘዙት';

        $message = "ውድ ደንበኛችን {$this->preOrder->client_name}\n\n";
        $message .= "ከካልዲስ ኮፊ በቅድመ ትዕዛዝ {$orderMethod} የበዓል ቶርታ ተረጋግጧል።\n\n";
        $message .= "* የትዕዛዝ መለያ፥ {$this->preOrder->order_number}\n";
        $message .= "* ያዘዙት ቶርታ፥ {$products}\n";
        $message .= "* መውሰጃ ቀን፥ {$this->preOrder->collectionDay->name}\n";
        $message .= "* መውሰጃ ቅርንጫፍ፥ {$this->preOrder->collectionBranch->name}\n";
        $message .= "* ቅናሽ አይነት፥ {$discountType}\n\n";
        $message .= "መልካም ገና";
        
        return $message;
    }
}
